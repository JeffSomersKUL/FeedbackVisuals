import { cp } from "shelljs";
import { IConfig, IStatisticsItem, IStatisticsItemType, ToetsCode } from "../../../frontend/src/Shared/data";
import { MyFileReader } from "./MyFileReader";

export class StatisticsReader extends MyFileReader<IStatisticsItem[], IStatisticsItem | undefined> {
    public handlesFile(fileName: string): boolean {
        return !!fileName.match(/\d+-[a-z][a-z]-statistieken/);
    }
    public readFile(filePath: string): IStatisticsItem[] {
        const csvData = this.readCSV(filePath);
        return csvData.lines.map((c) => this.parseLine(c, csvData.titles)).filter((d) => !!d);

    }

    public parseLine(line: string, titles: string[]): IStatisticsItem | undefined {
        return this.parseCSVLine(line, titles, (rowData: Map<string, string>): IStatisticsItem | undefined => {
            const key = rowData.get("key");
            const value = Number(rowData.get("value"));

            let data: [IStatisticsItemType, string?, number?] | undefined;
            const highestScoreMatch = key.match(/(.*)HoogsteScore/);
            if (highestScoreMatch) {
                data = ["highest", highestScoreMatch[1]];
            }
            const lowestScoreMatch = key.match(/(.*)LaagsteScore/);
            if (lowestScoreMatch) {
                data = ["lowest", lowestScoreMatch[1]];
            }
            const meanScoreMatch = key.match(/(.*)GemiddeldeScore/);
            if (meanScoreMatch) {
                data = ["mean", meanScoreMatch[1]];
            }
            const medianScoreMatch = key.match(/(.*)MediaanScore/);
            if (medianScoreMatch) {
                data = ["median", medianScoreMatch[1]];
            }

            const amountScoreMatch = key.match(/(.*)AantalScore(\d+)/);
            if (amountScoreMatch) {
                data = ["scoreAmounts", amountScoreMatch[1], Number(amountScoreMatch[2])];
            }

            if (key === "aantalDeelnemers") {
                data = ["amountOfStudents"];
            }

            if (data) {
                return {
                    subScoreName: data[1],
                    type: data[0],
                    value,
                    arg: data[2]
                };
            }
            return undefined;
        });
    }

    protected getName(): string {
        return "statistics";
    }
}
