export interface IVector2D {
    x: number;
    y: number;
}

export interface AffineTransform2D {
    s: IVector2D;
    r: IVector2D;
    t: IVector2D;
}