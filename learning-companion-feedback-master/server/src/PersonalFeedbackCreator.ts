import fs from "fs";
import { CSEScorePart, IConfig, IStatisticsItem, PeerScorePart, ProcessedData, Statistics } from "../../frontend/src/Shared/data";
import { AntwoordenReader, IAntwoord } from "./FileReaders/AntwoordenReader";
import { ConfigReader } from "./FileReaders/ConfigReader";
import { CSEScoreReader, ICSEScore, ICSEScores } from "./FileReaders/CSEScoreReader";
import { IndexedCSVData, MyFileReader } from "./FileReaders/MyFileReader";
import { IPeerScore, IPeerScores, PeerScoreReader } from "./FileReaders/PeerScoreReader";
import { IScores, ScoreReader } from "./FileReaders/ScoreReader";
import { StatisticsReader } from "./FileReaders/StatisticsReader";
import { IVraagAntwoordData, VraagAntwoordenReader } from "./FileReaders/VraagAntwoordenReader";
import { Vragenlijsten, VragenlijstReader } from "./FileReaders/VragenlijstReader";

export function createPersonalFeedbackFiles(sessie: string, toets: string) {

    const dataPath = "persist/data";
    const feedbackFilesPath = `${dataPath}/feedbackFiles`;
    const dataFiles = fs.readdirSync(feedbackFilesPath).filter((f) => f.startsWith(`${sessie}-${toets}`));

    let config: IConfig | undefined;
    let vragenlijsten: Vragenlijsten;
    let scoreData: IndexedCSVData;
    let antwoordenData: IndexedCSVData;
    let vraagAntwoordData: IVraagAntwoordData[];
    let peerScores: IPeerScores;
    let cseScores: ICSEScores;
    let statisticsItems: IStatisticsItem[];

    type Reader =
    ConfigReader
    | VragenlijstReader
    | ScoreReader
    | VraagAntwoordenReader
    | AntwoordenReader
    | PeerScoreReader
    | CSEScoreReader
    | StatisticsReader;

    interface ReaderMap {
        reader: Reader;
        map: (arg: any) => void;
    }

    const scoreReader = new ScoreReader();
    const antwoordenReader = new AntwoordenReader();
    const readers: ReaderMap[] = [
        { reader: new ConfigReader(), map: (arg: IConfig) => config = arg },
        { reader: new VragenlijstReader(), map: (arg: Vragenlijsten) => vragenlijsten = arg },
        { reader: scoreReader, map: (arg: IndexedCSVData) => scoreData = arg  },
        { reader: antwoordenReader, map: (arg: IndexedCSVData) => antwoordenData = arg },
        { reader: new VraagAntwoordenReader(), map: (arg: IVraagAntwoordData[]) => vraagAntwoordData = arg },
        { reader: new PeerScoreReader(), map: (arg: IPeerScores) => peerScores = arg },
        { reader: new CSEScoreReader(), map: (arg: ICSEScores) => cseScores = arg },
        { reader: new StatisticsReader(), map: (arg: IStatisticsItem[]) => statisticsItems = arg },
    ];

    let shouldFail = false;
    for (const readerItem of readers) {
        const { reader, map } = readerItem;
        const readerFiles = dataFiles.filter((f) => reader.handlesFile(f));
        if (readerFiles.length == 1) {
            map(reader.readFile(`${feedbackFilesPath}/${readerFiles[0]}`, config));
        } else if (readerFiles.length > 1) {
            console.error("Found multiple data-files of same type: " + readerFiles.join(", "));
    } else {
            shouldFail = reader.handleNoFile() || shouldFail;
    }
    }
    if (shouldFail) {
        console.error("Fatale errors");
        throw(new Error("Fatale errors"));
    }

    console.log("Removing current files");
    const currentFiles = fs.readdirSync(`${dataPath}/personalFeedback`).filter((f) => f.startsWith(`${sessie}${toets}`));
    for (const currentFile of currentFiles) {
        console.log(`Removed ${currentFile}`);
        fs.unlinkSync(`${dataPath}/personalFeedback/${currentFile}`);
    }

    const statistics: Statistics = {
        amountOfParticipants: statisticsItems.find((s) => s.type === "amountOfStudents").value,
        subScoreStatistics: config.subscores.map((c) => ({
            subScoreName: c.name,
            highestScore: statisticsItems.find((s) => s.subScoreName === c.name && s.type === "highest").value,
            lowestScore: statisticsItems.find((s) => s.subScoreName === c.name && s.type === "lowest").value,
            meanScore: statisticsItems.find((s) => s.subScoreName === c.name && s.type === "mean").value,
            medianScore: statisticsItems.find((s) => s.subScoreName === c.name && s.type === "median").value,
            scoreAmounts: statisticsItems.filter((s) => s.subScoreName === c.name && s.type === "scoreAmounts").map((s) => ({
                score: s.arg,
                amount: s.value
            }))
        }))
    };

    const parseData = (): ProcessedData[] => {
        const deelnemers = Object.keys(scoreData.lines);
        return deelnemers.map((feedbackCode): ProcessedData => {
            const scores: IScores = scoreReader.parseLine(scoreData.lines[feedbackCode], scoreData.titles, config);
            const answers: IAntwoord = antwoordenReader.parseLine(antwoordenData.lines[feedbackCode], antwoordenData.titles, config);
            const answerData = vraagAntwoordData;
            const questionnaire = scores.vragenReeks;
            return {
                passed: scores.geslaagd,
                questionnaire,
                scores: config.subscores.map((s) => {
                    const score = scores.scores.get(s.name);
                    let peerScore: IPeerScores = [];
                    if (peerScores.length > 0) {
                        peerScore = peerScores.filter((d) => d.scoreNaam === s.name);
                    }
                    let cseScore: ICSEScores = [];
                    if (cseScores && cseScores.length > 0) {
                        cseScore = cseScores.filter((d) => d.scoreNaam === s.name);
                    }
                    return {
                        name: s.name,
                        score: {
                            score: score.score,
                            maxScore: score.maxScore,
                            hasBreakdown: score.heeftOpdeling,
                            numberCorrect: score.juist,
                            numberWrong: score.fout,
                            numberBlanco: score.blanco,
                            groupLabel: score.groepLabel
                        },
                        peerScore: (peerScore.length > 0) ? peerScore.reduce((obj, p) => {
                            return {
                                parts: obj.parts.concat({
                                    label: p.groepLabel,
                                    amount: p.aantal,
                                    color: p.kleur
                                })
                            };
                        }, { parts: [] as PeerScorePart[] }) : undefined,
                        cseScore: (cseScore.length > 0) ? cseScore.reduce((obj, p) => {
                            return {
                                parts: obj.parts.concat({
                                    scoreGroupLabel: p.scoreGroepLabel,
                                    scoreGroupColor: p.scoreGroepKleur,
                                    cseGroupLabel: p.cseGroepLabel,
                                    cseGroupColor: p.cseGroepKleur,
                                    percentage: p.percentage
                                })
                            };
                        }, { parts: [] as CSEScorePart[] }) : undefined
                    };
                }),
                answers: (answers) ? [...answers.antwoorden.keys()].map((n) => {
                    let currentAnswerData;
                    if (answerData) {
                        currentAnswerData = answerData.filter((d) => d.vraagId === n);
                    }
                    return {
                        questionId: n,
                        position: vragenlijsten.find((v) => v.getVragenReeks() === questionnaire).getPosition(n),
                        givenAnswer: answers.antwoorden.get(n),
                        correctAnswer: (currentAnswerData.length > 0) ? currentAnswerData[0].juisteAntwoord : undefined,
                        allAnswers: (currentAnswerData.length > 0) ? {
                            A: currentAnswerData[0].aantalA,
                            B: currentAnswerData[0].aantalB,
                            C: currentAnswerData[0].aantalC,
                            D: currentAnswerData[0].aantalD,
                            E: currentAnswerData[0].aantalE,
                            X: currentAnswerData[0].aantalBlanco,
                        } : undefined,
                        percentageCorrect: (currentAnswerData.length > 0) ? currentAnswerData[0].percentageJuist : undefined,
                        percentageBlanco: (currentAnswerData.length > 0) ? currentAnswerData[0].percentageBlanco : undefined,
                    };
                }) : [],
                feedbackCode,
                config,
                statistics
            };
        });
    };

    const items = parseData();
    const addedFiles: string[] = [];
    for (const item of items) {
        const fileName = `${dataPath}/personalFeedback/${item.feedbackCode}.json`;
        fs.writeFileSync(fileName, JSON.stringify(item, null, 2));
        console.log(`Created ${fileName}`);
        addedFiles.push(fileName);
    }
    console.log(`Created ${addedFiles.length} files`);

    return addedFiles;
}
