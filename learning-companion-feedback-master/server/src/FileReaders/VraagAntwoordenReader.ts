import { MyFileReader } from "./MyFileReader";

export interface IVraagAntwoordData {
    vraagId: number;
    juisteAntwoord: string;
    aantalAntwoorden: number;
    aantalJuist: number;
    percentageJuist: number;
    aantalBlanco: number;
    percentageBlanco: number;
    aantalA: number;
    aantalB: number;
    aantalC: number;
    aantalD: number;
    aantalE?: number;
}

export class VraagAntwoordenReader extends MyFileReader<IVraagAntwoordData[], IVraagAntwoordData> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/(\d+)-([a-z][a-z])-vraagAntwoorden/);
    }

    public readFile(filePath: string): IVraagAntwoordData[] {
        const csvData = this.readCSV(filePath);
        return csvData.lines.map((c) => this.parseLine(c, csvData.titles));
    }

    public parseLine(line: string, titles: string[]): IVraagAntwoordData {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): IVraagAntwoordData => {
            return {
                vraagId: Number(rowData.get("vraagId")),
                aantalAntwoorden: Number(rowData.get("aantalAntwoorden")),
                juisteAntwoord: rowData.get("juisteAntwoord"),
                aantalJuist: Number(rowData.get("aantalJuist")),
                percentageJuist: Number(rowData.get("percentageJuist")),
                aantalBlanco: Number(rowData.get("aantalBlanco")),
                percentageBlanco: Number(rowData.get("percentageBlanco")),
                aantalA: Number(rowData.get("aantalA")),
                aantalB: Number(rowData.get("aantalB")),
                aantalC: Number(rowData.get("aantalC")),
                aantalD: Number(rowData.get("aantalD")),
                aantalE: rowData.get("aantalE") ? Number(rowData.get("aantalE")) : undefined,
            };
        });
    }

    protected getName(): string {
        return "vraagAntwoorden";
    }
}
