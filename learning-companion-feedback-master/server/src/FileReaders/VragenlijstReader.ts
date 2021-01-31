import { IConfig } from "../../../frontend/src/Shared/data";
import { MyFileReader } from "./MyFileReader";

export class Vragenlijst {
    private vragenReeks: number;
    private vragen: number[];
    constructor(vragenReeks: number, aantalVragen: number) {
        this.vragenReeks = vragenReeks;
        this.vragen = [];
        for (let i = 0; i < aantalVragen; i++) {
            this.vragen.push(-1);
        }
    }

    public getVragenReeks() {
        return this.vragenReeks;
    }

    public addMapping(vraagId: number, position: number) {
        this.vragen[vraagId - 1] = position;
    }

    public getPosition(vraagId: number) {
        return this.vragen[vraagId - 1];
    }
}
export type Vragenlijsten = Vragenlijst[];

export class VragenlijstReader extends MyFileReader<Vragenlijsten, Vragenlijst> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/\d+-[a-z][a-z]-vragenlijsten/);
    }

    public readFile(filePath: string, config?: IConfig): Vragenlijsten {
        const csvData = this.readCSV(filePath);
        return csvData.lines.map((c) => this.parseLine(c, csvData.titles, config));
    }

    public parseLine(line: string, titles: string[], config?: IConfig): Vragenlijst {
        if (!config) {
            throw new Error("VragenlijstReader.parseLine needs a config");
        }
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): Vragenlijst => {
            const vragenlijst = new Vragenlijst(Number(rowData.get("vragenReeks")), config.aantalVragen);

            for (let vraagId = 1; vraagId <= config.aantalVragen; vraagId++) {
                vragenlijst.addMapping(vraagId, Number(rowData.get(`vraag${vraagId}`)));
            }

            return vragenlijst;
        });
    }

    protected getName(): string {
        return "vragenlijsten";
    }
}
