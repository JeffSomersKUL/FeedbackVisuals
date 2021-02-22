import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import * as basicAuth from "express-basic-auth";
import rateLimit from "express-rate-limit";
import fs from "fs";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { feedbackFileTypes, parseFeedbackCode, ParticipationResponse, ProcessedData, Program } from "../../frontend/src/Shared/data";
import { createPersonalFeedbackFiles } from "./PersonalFeedbackCreator";

const accessLogStream = fs.createWriteStream(`logs/access-${Math.random().toString(36).substring(7)}.log`, { flags: "a" });

const IS_EDITOR = process.env.IS_EDITOR === "true";

// TODO: persist etc to functions
const programMapping: {[programCode: string]: string } = JSON.parse(fs.readFileSync("persist/config/mapping.json", "utf8"));
const editorKeys: { [programCode: string]: string[] } = JSON.parse(fs.readFileSync("persist/config/editor_keys.json", "utf8"));

const app = express();
app.set("trust proxy", 1);
app.use(morgan(":method :url :status :response-time ms [:date[iso]]", {
        skip(req: any, res: any) {
            return req.path.startsWith("/static")
                || req.path.startsWith("/logo-ijkingstoets")
                || req.path.startsWith("/manifest.json");
        },
        stream: accessLogStream
    }
));

if (IS_EDITOR) {
    const shell = require("shelljs");
    let latestFetch = 0;

    app.use(cors());
    app.use(bodyParser.json());

    const fetchAndPullPersistIfTooLongAgo = (): void => {
        const n = Date.now();
        if (n - latestFetch > 1000 * 60 * 5) { // Once in five minutes
            fetchAndPullPersist();
        }
    };

    app.get("/fetch", (req, res) => {
        fetchAndPullPersistIfTooLongAgo();
        res.sendStatus(200);
    });

    const fetchAndPullPersist = (): void => {
        console.log("Fetching and pulling persist");
        const out = shell.exec("cd persist && git fetch && git pull");
        console.log("status: " + out.code);
        if (out.code === 0) {
            latestFetch = Date.now();
        }
    };

    const commitFiles = (filePathsRelativeToPersist: string[]): void => {
        console.log(`Committing changes to ${filePathsRelativeToPersist.join(" ")} in persist`);
        let out = shell.exec(`cd persist && git add ${filePathsRelativeToPersist.join(" ")} && git commit -m "Update ${filePathsRelativeToPersist.join(" ")}"`);
        console.log("status: " + out.code);
        fetchAndPullPersist();

        console.log(`Push changes to ${filePathsRelativeToPersist.join(" ")}`);
        out = shell.exec(`cd persist && git push`);
        console.log("status: " + out.code);
    };

    const minSessionAllowedToChange = 0; // TODO ?
    app.post("/steps/:session/:program", (req, res) => {
        if (! (Number(req.params.session) >= minSessionAllowedToChange)) {
            res.sendStatus(406);
            return;
        }

        if (!req.body) { // Missing body data
            res.sendStatus(500);
        }

        if (editorKeys[req.params.program].indexOf(req.headers["x-feedbackcode"] as string) > -1) {
            const filePathRelativeToPersist = `steps/${req.params.session}/${req.params.program}.json`;
            fs.writeFileSync(`persist/${filePathRelativeToPersist}`, JSON.stringify(req.body, null, 2));
            commitFiles([filePathRelativeToPersist]);
            res.send(JSON.stringify(req.body));
        } else {
            res.sendStatus(404);
        }
    });

    const feedbackFilesTmpStorage = multer.diskStorage({
        destination: "./persist/tmp",
    });
    const feedbackFilesUpload = multer({ storage: feedbackFilesTmpStorage });

    const feedbackUploadFields = feedbackFilesUpload.array("feedbackFiles", feedbackFileTypes.length);
    app.post("/upload/feedbackFiles/:session/:program", feedbackUploadFields, function(req, res) {
        if (editorKeys.admin.indexOf(req.headers["x-feedbackcode"] as string) > -1) {
            const programKey = req.params.program;
            const session = Number(req.params.session);
            const validFileNames = feedbackFileTypes.map((f) => `${session}-${programKey}-${f}.tsv`);
            const uploadedFiles = (req.files as Express.Multer.File[]);
            const files = uploadedFiles.filter((f) => validFileNames.indexOf(f.originalname) > -1);

            files.forEach((f) => {
                fs.copyFileSync(f.path, `./persist/data/feedbackFiles/${f.originalname}`);
                console.log(`Added feedback file ${f.originalname}`);
            });
            uploadedFiles.forEach((f) => fs.unlinkSync(f.path)); // Delete tmp files
            if (files.length > 0) {
                commitFiles(files.map((f) => `data/feedbackFiles/${f.originalname}`));
            }

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    app.post("/process/:session/:program", feedbackUploadFields, function(req, res) {
        if (editorKeys.admin.indexOf(req.headers["x-feedbackcode"] as string) > -1) {
            const programKey = req.params.program;
            const session = Number(req.params.session);

            createPersonalFeedbackFiles(`${session}`, programKey);
            commitFiles([`data/personalFeedback/${session}${programKey}*.json`]);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    const toName = (code: string) => programMapping[code];

    const getPrograms = async () => {
        const sessionDirs = fs.readdirSync(`persist/steps`, "utf8");
        const programs: Program[] = [];

        for (const session of sessionDirs) {
            const sessionPrograms = fs.readdirSync(`persist/steps/${session}`, "utf8").map((s) => s.replace(".json", "")).map((code) => ({ name: toName(code), code })).filter((p) => p.name);
            for (const sessionProgram of sessionPrograms) {
                const matchingProgram = programs.find((p) => p.code === sessionProgram.code);
                if (matchingProgram) {
                    matchingProgram.sessions.push({
                        session: Number(session),
                        files: await getProgramFiles(session, sessionProgram.code)
                    });
                } else {
                    programs.push({
                        ...sessionProgram,
                        sessions: [{
                            session: Number(session),
                            files: await getProgramFiles(session, sessionProgram.code)
                        }]
                    });
                }
            }
        }

        return programs;
    };

    const getFileChangeInGit = (filePathRelativeToPersist: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            shell.exec(`cd persist && git log -1 --format=%cd ${filePathRelativeToPersist}`, function(code: number, stdout: string, stderr: string) {
                if (code === 0) {
                    resolve(stdout.trim());
                }
                reject(stderr);
            });
        });
    };

    const getProgramFiles = (session: string, program: string) => {
        const feedbackFiles = fs.readdirSync(`./persist/data/feedbackFiles`, "utf8")
            .filter((f) => f.startsWith(`${session}-${program}-`) && f.endsWith(".tsv"));
        const personalFeedbackFiles = fs.readdirSync(`./persist/data/personalFeedback`, "utf8")
            .filter((f) => f.startsWith(`${session}${program}`) && f.endsWith(".json"));

        const feedbackFilesLastChangedPromise: Promise<string> | string = (feedbackFiles.length > 0) ? getFileChangeInGit(`data/feedbackFiles/${session}-${program}-*.tsv`) : "";
        const personalFeedbackFilesLastChangedPromise: Promise<string> | string = (personalFeedbackFiles.length > 0) ? getFileChangeInGit(`data/personalFeedback/${session}${program}*.json`) : "";

        return Promise.all([feedbackFilesLastChangedPromise, personalFeedbackFilesLastChangedPromise])
            .then((results) => ({
                feedbackFiles,
                feedbackFilesLastChanged: results[0],
                personalFeedbackFiles,
                personalFeedbackFilesLastChanged: results[1]
            }));
    };

    // Read folder under persist/steps to find the last session -> Adding a new session = copying folder of previous session to persist/steps/<newsessionid>
    app.get("/programs", (req, res) => {
        if (editorKeys.admin.indexOf(req.headers["x-feedbackcode"] as string) > -1) {
            getPrograms().then((p) => res.send(p));
        } else {
            res.sendStatus(404);
        }
    });
} else {
    // const PROXY_PATH = process.env.PROXY_PATH;
    // if (!PROXY_PATH) {
    //     console.error("Missing PROXY PATH");
    //     process.exit(1);
    // }
    const proxy = require("express-http-proxy");
    app.use("/", proxy("localhost:3000", {
        filter(req: {method: String, path: String}, _res: unknown) {
            return req.method === "POST" || (req.method === "GET" && (req.path === "/programs" || req.path === "/fetch")); // Proxy all post requests, get programs and get fetch
        },
        parseReqBody: false
    }));
    // Fix https (challenge of certbot)
    app.get("/.well-known/acme-challenge/_yeNzhhsXiix-PVVyeJ_Yl8bh7AFzaP5bXfE5GGW08M", (req, res) => {
        res.send("_yeNzhhsXiix-PVVyeJ_Yl8bh7AFzaP5bXfE5GGW08M.RucQhw5MHUEoMjuC9swiaSK96g7KDfeJwg-fi9SIfCI");
    });
    app.use(express.static(path.join(process.cwd(), "build")));
    app.use(cors());
    app.use(bodyParser.json());

    const feedbackCodeLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minute window
        max: 20, // start blocking after 20 requests
        message:
            "Too many feedback codes entered from this IP, please try again after 15 minutes"
    });

    const getFeedback = (feedbackCode: string): ProcessedData | undefined => {
        try {
            return JSON.parse(fs.readFileSync(`persist/data/personalFeedback/${feedbackCode}.json`).toString());
        } catch (e) {
            return undefined;
        }
    };

    app.get("/steps/:session/:program", (req, res) => {
        if (programMapping[req.params.program]) {
            res.send(JSON.parse(fs.readFileSync(`persist/steps/${req.params.session}/${req.params.program}.json`, "utf8")));
        } else {
            res.sendStatus(404);
        }
    });

    app.get("/data/:session/:program/:feedbackCode", (req, res) => {
        const feedbackCodeInfo = parseFeedbackCode(req.params.feedbackCode);
        const programKey = req.params.program;
        const session = Number(req.params.session);
        if (feedbackCodeInfo && req.params.feedbackCode.match(new RegExp(`^${session}${programKey}.*$`))) {
            const data = getFeedback(feedbackCodeInfo.feedbackCode!);
            if (!data) {
                res.sendStatus(404);
            } else {
                res.send(JSON.stringify({ ...data, canEdit: false } as ParticipationResponse));
            }
        } else {
            if (editorKeys[programKey].indexOf(req.params.feedbackCode) > -1) {
                const files = fs.readdirSync("persist/data/personalFeedback")
                    .filter((file) => file.startsWith(`${session}${programKey}`));
                if (files.length > 0) {
                    const file = files[Math.floor(Math.random() * files.length)];
                    const responseItem: ParticipationResponse = {
                        ...getFeedback(file.split(".json")[0]),
                        canEdit: true,
                    };
                    res.send(JSON.stringify(responseItem));
                } else {
                    res.send(JSON.stringify({ canEdit: true }));
                }
            } else {
                res.sendStatus(404);
            }
        }
    });

    app.get("/images/question/:qnumber/:feedbackCode", (req, res) => {
        const feedbackCodeInfo = parseFeedbackCode(req.params.feedbackCode);
        const questionNumber = req.params.qnumber;
        const isExistingFeedbackCode = () => fs.readdirSync("persist/data/personalFeedback")
            .filter((f) => f === `${feedbackCodeInfo.feedbackCode!}.json`)
            .length === 1 ||
            Object.keys(editorKeys).filter((e) => editorKeys[e].indexOf(feedbackCodeInfo.feedbackCode) > -1).length === 1;
        if ((feedbackCodeInfo && isExistingFeedbackCode())) { // images only visible with valid feedbackCode or to editors
            try {
            res.send(fs.readFileSync(`persist/data/pictures/${feedbackCodeInfo.session}-${feedbackCodeInfo.program}-question-${questionNumber}.png`));
            } catch (e) {
                res.sendStatus(500);
            }
            return;
        }
        res.sendStatus(404);
    });

    app.get("*", (req, res) => {
        res.sendFile(path.join(process.cwd(), "build/index.html"));
    });
}

app.get("/crash", basicAuth.default({
    users: { resetter: process.env.RESETTER },
    challenge: true
}), function(req, res) {
    process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.info(`Listening on port ${PORT}`);
if (IS_EDITOR) {
    console.info(`with editor powers`);
}
