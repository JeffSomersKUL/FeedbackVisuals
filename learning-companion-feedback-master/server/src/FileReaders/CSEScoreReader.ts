import { MyFileReader } from "./MyFileReader";

export interface ICSEScore {
    scoreNaam: string;
    scoreGroepLabel: string;
    scoreGroepKleur: string;
    cseGroepLabel: string;
    cseGroepKleur: string;
    percentage: number;
}
export type ICSEScores = ICSEScore[];

export class CSEScoreReader extends MyFileReader<ICSEScore[], ICSEScore> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/(\d+)-([a-z][a-z])-cseScores/);
    }

    public readFile(filePath: string): ICSEScore[] {
        const csvData = this.readCSV(filePath);
        return csvData.lines.map((c) => this.parseLine(c, csvData.titles));
    }

    public parseLine(line: string, titles: string[]): ICSEScore {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): ICSEScore => {
            return {
                scoreNaam: rowData.get("scoreNaam"),
                scoreGroepLabel: rowData.get("scoreGroepLabel"),
                scoreGroepKleur: rowData.get("scoreGroepKleur"),
                cseGroepLabel: rowData.get("cseGroepLabel"),
                cseGroepKleur: rowData.get("cseGroepKleur"),
                percentage: Number(rowData.get("percentage"))
            };
        });
    }

    public handleNoFile(): boolean {
        console.error(`Missing ${this.getName()} file, continuing`);
        return false;
    }

    protected getName(): string {
        return "cseScores";
    }
}
