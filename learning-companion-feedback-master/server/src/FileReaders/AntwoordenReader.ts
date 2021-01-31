import { IConfig } from "../../../frontend/src/Shared/data";
import { IndexedCSVData, MyFileReader } from "./MyFileReader";

export type AnswerValue = "A" | "B" | "C" | "D" | "E" | "X";

export interface IAntwoord {
    feedbackCode: string;
    antwoorden: Map<number, AnswerValue>;
}

export class AntwoordenReader extends MyFileReader<IndexedCSVData, IAntwoord> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/\d+-[a-z][a-z]-antwoorden/);
    }

    public readFile(filePath: string): IndexedCSVData {
        const csvData = this.readCSV(filePath);
        return this.toIndexedCSVData(csvData,
            (line: string, titles: string[]) => this.parseLine(line, titles).feedbackCode);

    }

    public parseLine(line: string, titles: string[], config?: IConfig): IAntwoord {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): IAntwoord => {
            const antwoorden: Map<number, AnswerValue> = new Map();
            titles.map((s) => s.match(/vraag(\d+)/)).filter((s) => s).forEach((m) => {
                antwoorden.set(Number(m[1]), rowData.get(m[0]) as AnswerValue);
            });
            return {
                feedbackCode: rowData.get("feedbackCode"),
                antwoorden,
            };
        });
    }

    protected getName(): string {
        return "antwoorden";
    }

}
