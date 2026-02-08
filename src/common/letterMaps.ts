import type { BlockMap } from './interfaces';

export type CapitalLetters =
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

export const START_MAP: BlockMap = {
    ul: { x: 0, y: 0 },
    ur: { x: 1, y: 0 },
    ll: { x: 0, y: 1 },
    lr: { x: 1, y: 1 },
};

export const BASE_MAPS: Partial<Record<CapitalLetters, BlockMap[]>> = {
    H: [
        {
            ul: { x: 0, y: 1 },
            ur: { x: 0, y: 0 },
            ll: { x: 0.33, y: 1 },
            lr: { x: 0.33, y: 0 },
        },
        {
            ul: { x: 0.33, y: 0.33 },
            ur: { x: 0.67, y: 0.33 },
            ll: { x: 0.33, y: 0.67 },
            lr: { x: 0.67, y: 0.67 },
        },
        {
            ul: { x: 0.67, y: 1 },
            ur: { x: 0.67, y: 0 },
            ll: { x: 1, y: 1 },
            lr: { x: 1, y: 0 },
        },
    ],
};
