import type { BlockMap, CapitalLetters } from './interfaces';

export const BASE_MAPS: Partial<Record<CapitalLetters, BlockMap[]>> = {
    E: [
        {
            // left-upright bar
            ul: { x: 0, y: 1 },
            ur: { x: 0, y: 0 },
            ll: { x: 0.25, y: 1 },
            lr: { x: 0.25, y: 0 },
        },
        {
            // top bar
            ul: { x: 0.25, y: 0 },
            ur: { x: 1, y: 0 },
            ll: { x: 0.25, y: 0.25 },
            lr: { x: 1, y: 0.25 },
        },
        {
            // middle bar
            ul: { x: 0.25, y: 0.375 },
            ur: { x: 0.5, y: 0.375 },
            ll: { x: 0.25, y: 0.625 },
            lr: { x: 0.5, y: 0.625 },
        },
        {
            // bottom bar
            ul: { x: 0.25, y: 0.75 },
            ur: { x: 1, y: 0.75 },
            ll: { x: 0.25, y: 1 },
            lr: { x: 1, y: 1 },
        },
    ],
    H: [
        {
            // left-upright bar
            ul: { x: 0, y: 1 },
            ur: { x: 0, y: 0 },
            ll: { x: 0.25, y: 1 },
            lr: { x: 0.25, y: 0 },
        },
        {
            // middle bar
            ul: { x: 0.25, y: 0.375 },
            ur: { x: 0.75, y: 0.375 },
            ll: { x: 0.25, y: 0.625 },
            lr: { x: 0.75, y: 0.625 },
        },
        {
            // right-upright bar
            ul: { x: 0.75, y: 1 },
            ur: { x: 0.75, y: 0 },
            ll: { x: 1, y: 1 },
            lr: { x: 1, y: 0 },
        },
    ],
};
