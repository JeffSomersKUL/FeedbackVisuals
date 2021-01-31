import { MyFileReader } from "./MyFileReader";

export interface IPeerScore {
    scoreNaam: string;
    groepLabel: string;
    aantal: number;
    kleur: string;
}
export type IPeerScores = IPeerScore[];

export class PeerScoreReader extends MyFileReader<IPeerScores, IPeerScore> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/(\d+)-([a-z][a-z])-peerScores/);
    }

    public readFile(filePath: string): IPeerScores {
        const csvData = this.readCSV(filePath);
        return csvData.lines.map((c) => this.parseLine(c, csvData.titles));
    }

    public parseLine(line: string, titles: string[]): IPeerScore {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): IPeerScore => {
            return {
                scoreNaam: rowData.get("scoreNaam"),
                groepLabel: rowData.get("groepLabel"),
                aantal: Number(rowData.get("aantal")),
                kleur: rowData.get("kleur"),
            };
        });
    }

    protected getName(): string {
        return "peerScores";
    }

}
