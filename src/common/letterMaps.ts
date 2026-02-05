import type { AffineTransform2D } from './interfaces';

type CapitalLetters =
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';

export const LETTER_MAPS: Partial<Record<CapitalLetters, AffineTransform2D[]>> = {
    H: [
        {
            s: { x: 0, y: 0 },
            r: { x: -1, y: 0.33 },
            t: { x: 0, y: 1 },
        },
        {
            s: { x: 0.34, y: 0.34 },
            r: { x: 0, y: 0 },
            t: { x: 0.33, y: 0.33 },
        },
        {
            s: { x: 0, y: 0 },
            r: { x: -1, y: 0.33 },
            t: { x: 0.67, y: 1 },
        },
    ] as AffineTransform2D[],
};
