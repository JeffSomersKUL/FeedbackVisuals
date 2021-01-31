import { IConfig } from "../../../frontend/src/Shared/data";
import { IndexedCSVData, MyFileReader } from "./MyFileReader";

export interface IScores {
    feedbackCode: string;
    scores: Map<string, IScore>;
    geslaagd: boolean;
    vragenReeks: number;
}

export interface IScore {
    score: number;
    maxScore: number;
    heeftOpdeling: boolean;
    juist?: number;
    fout?: number;
    blanco?: number;
    groepLabel?: string;
}

export class ScoreReader extends MyFileReader<IndexedCSVData, IScores> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/\d+-[a-z][a-z]-scores/);
    }

    public readFile(filePath: string, config?: IConfig): IndexedCSVData {
        const csvData = this.readCSV(filePath);
        return this.toIndexedCSVData(csvData,
            (line: string, titles: string[]) => this.parseLine(line, titles, config).feedbackCode);
    }

    public parseLine(line: string, titles: string[], config?: IConfig): IScores {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): IScores => {
            const scores = new Map<string, IScore>();
            if (config && config.subscores) {
                config.subscores.forEach((s) => {
                    const score: IScore = {
                        score: Number(rowData.get(`${s.name}Score`)),
                        maxScore: s.maxScore,
                        heeftOpdeling: false
                    };
                    if (rowData.has(`${s.name}Juist`) && rowData.has(`${s.name}Fout`) && rowData.has(`${s.name}Blanco`)) {
                        score.heeftOpdeling = true;
                        score.juist = Number(rowData.get(`${s.name}Juist`));
                        score.fout = Number(rowData.get(`${s.name}Fout`));
                        score.blanco = Number(rowData.get(`${s.name}Blanco`));
                    }
                    if (rowData.has(`${s.name}Groep`)) {
                        score.groepLabel = rowData.get(`${s.name}Groep`);
                    }

                    scores.set(s.name, score);
                });
            }

            return {
                feedbackCode: rowData.get("feedbackCode"),
                geslaagd: rowData.get("geslaagd") === "1",
                scores,
                vragenReeks: Number(rowData.get("vragenReeks"))
            };
        });
    }

    protected getName(): string {
        return "scores";
    }

}
