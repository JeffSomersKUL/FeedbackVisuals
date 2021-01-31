import { IConfig, ToetsCode } from "../../../frontend/src/Shared/data";
import { MyFileReader } from "./MyFileReader";

interface KeyVal {
    key: string;
    value: string;
}

export class ConfigReader extends MyFileReader<IConfig, KeyVal> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/\d+-[a-z][a-z]-config/);
    }
    public readFile(filePath: string): IConfig {
        const csvData = this.readCSV(filePath);
        const keyValues = csvData.lines.map((c) => this.parseLine(c, csvData.titles)).reduce((m, i) => {
            m.set(i.key, i.value);
            return m;
        }, new Map<string, string>());
        const subScoreNames = keyValues.get("subScores").split("|").map((s: string) => s.toLowerCase().trim());
        const subscores = subScoreNames.map((s: string) => {
            return {
                name: s,
                maxScore: Number(keyValues.get(`${s}-maxScore`)),
                vragenIds: (keyValues.has(`${s}-vragen`)) ? keyValues.get(`${s}-vragen`).split("|").map((n) => Number(n.trim())) : undefined
            };
        });
        return {
            toetsCode: keyValues.get("toetsCode") as ToetsCode, // TODO: check if supported code ?
            toetsSessie: Number(keyValues.get("toetsSessie")),
            aantalVragen: Number(keyValues.get("aantalVragen")),
            subscores,
        };
    }

    public parseLine(line: string, titles: string[]): KeyVal {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): { key: string, value: string } => {
            return {
                key: rowData.get("key"),
                value: rowData.get("value")
            };
        });
    }

    protected getName(): string {
        return "config";
    }
}
