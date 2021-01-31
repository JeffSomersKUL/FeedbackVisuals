import fs from "fs";

export interface CSVData {
    titles: string[];
    lines: string[];
}

export interface IndexedCSVData {
    titles: string[];
    lines: { [s: string]: string };
}

export abstract class MyFileReader<U, V> {

    constructor() {

    }

    public abstract handlesFile(fileName: string): boolean;

    public abstract readFile(filePath: string): U;

    public abstract parseLine(line: string, titles: string[]): V;

    public handleNoFile(): boolean {
        console.error(`Missing ${this.getName()} file`);
        return true;
    }

    protected readCSV(filePath: string) {
        const f = fs.readFileSync(filePath, "utf-8");
        const lines = f.split("\n");
        const firstLine = lines.shift(); // remove first element of lines
        const titles = firstLine.split("\t").map((s) => s.trim()).map((s) => { // Remove "quotes"
            let newS = s;
            while (newS.startsWith('"') && newS.endsWith('"')) {
                newS = newS.substring(1, newS.length - 1);
            }
            return newS;
        });
        return {
            titles,
            lines: lines.filter((l) => l.trim().length > 0)
        };
    }

    protected parseCSVLine <T>(line: string, titles: string[], objectCreator: (rowData: Map<string, string>) => T): T {
        return [line].map((line) => line.split("\t"))
            .filter((columns) => columns.length === titles.length)
            .map((columns) => {
                const rowData = new Map<string, string>();
                for (let i = 0; i < titles.length; i++) {
                    let value = columns[i].trim();
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    rowData.set(titles[i], value);
                }
                return objectCreator(rowData);
            })[0];
    }
    protected toIndexedCSVData = (csvData: CSVData, parseLineKey: (line: string, titles: string[]) => string): IndexedCSVData => {
        return {
            titles: csvData.titles,
            lines: csvData.lines.map((line: string) => ({ line, key: parseLineKey(line, csvData.titles) }))
                .reduce((acc: { [s: string]: string }, current: { key: string, line: string }) => {
                    if (acc[current.key]) {
                        throw new Error(`Multiple lines found for key ${current.key}`);
                    } else {
                        acc[current.key] = current.line;
                    }
                    return acc;
                }, {})
        };
    }

    protected abstract getName(): string;
}
