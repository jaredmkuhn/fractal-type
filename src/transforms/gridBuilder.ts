import { CapitalLetters, GridSection } from '../common/interfaces';

export class GridBuilder {
    private sections: GridSection[] = [];
    private celWidth = 0;
    private celHeight = 0;
    private readonly text: string;
    private readonly lines: number;

    constructor(width: number, height: number, text: string, lines: number = 1) {
        this.text = text.toUpperCase();
        if (lines < 1) {
            this.lines = 1;
        } else {
            this.lines = lines > this.text.length ? this.text.length : lines;
        }
        this.recalculateGrid(width, height);
    }

    public getSections(): GridSection[] {
        return this.sections;
    }

    public getCelSize(): { width: number; height: number } {
        return { width: this.celWidth, height: this.celHeight };
    }

    public recalculateGrid(width: number, height: number) {
        const letters = [...this.text] as CapitalLetters[];
        const colCount = Math.ceil(this.text.length / this.lines);

        this.sections = new Array<GridSection>();
        this.celWidth = width / colCount;
        this.celHeight = height / this.lines;

        for (let line = 0; line < this.lines; line++) {
            for (let column = 0; column < colCount; column++) {
                const index = column + line * colCount;
                this.sections.push({
                    offset: {
                        x: column * this.celWidth,
                        y: line * this.celHeight,
                    },
                    letter: index >= letters.length ? undefined : letters[index],
                });
            }
        }
    }
}
