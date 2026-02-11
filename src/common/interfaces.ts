export interface IVector2D {
    x: number;
    y: number;
}

export interface AffineTransform2D {
    s: IVector2D;
    r: IVector2D;
    t: IVector2D;
}

export interface BlockMap {
    ul: IVector2D;
    ur: IVector2D;
    ll: IVector2D;
    lr: IVector2D;
}

export interface GridSection {
    offset: IVector2D;
    celSize: IVector2D;
    letter?: CapitalLetters;
}

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
