import { CapitalLetters, GridSection, IVector2D } from '../common/interfaces';

export class GridBuilder {
    private sections: GridSection[] = [];

    constructor(text: string, lines: number = 1, padding: IVector2D = { x: 0.1, y: 0.1 }) {
        this.calculateGrid(text, this.normalizeLines(text, lines), padding);
    }

    public getSections(): GridSection[] {
        return this.sections;
    }

    private normalizeLines(text: string, lines: number) {
        if (lines < 1) {
            return 1;
        } else {
            return lines > text.length ? text.length : lines;
        }
    }

    private calculateGrid(text: string, lines: number, totalPadding: IVector2D) {
        const letters = [...text] as CapitalLetters[];
        const colCount = Math.ceil(text.length / lines);

        this.sections = new Array<GridSection>();
        const celWidth = 1 / colCount;
        const celHeight = 1 / lines;
        const padding = {
            x: colCount > 1 ? totalPadding.x / (colCount - 1) : 0,
            y: lines > 1 ? totalPadding.y / (lines - 1) : 0,
        };

        for (let line = 0; line < lines; line++) {
            for (let column = 0; column < colCount; column++) {
                const index = column + line * colCount;
                this.sections.push({
                    offset: {
                        x: column * celWidth,
                        y: line * celHeight,
                    },
                    celSize: {
                        x: column < colCount - 1 ? celWidth - padding.x : celWidth,
                        y: line < lines - 1 ? celHeight - padding.y : celHeight,
                    },
                    letter: index >= letters.length ? undefined : letters[index],
                });
            }
        }
    }
}
