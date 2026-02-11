import { AffineTransform2D, CapitalLetters } from '../../src/common/interfaces';
import { BASE_MAPS } from '../../src/common/letterMaps';
import { buildAffineMap } from '../../src/transforms/affineHelpers';

/**
 * Generates simplified affine transforms for a letter in a unit square
 * Testing/validation purposes only - not intended for production use
 * @param letter the letter to generate the affine transforms for
 * @returns an array of affine transforms for the given letter
 */
export function generateLetter(letter: CapitalLetters): AffineTransform2D[] {
    const baseMap = BASE_MAPS[letter];
    if (!baseMap) {
        throw new Error(`Unknown letter: ${letter}`);
    }
    const affines = new Array<AffineTransform2D>();

    baseMap.forEach((base) => {
        affines.push(buildAffineMap(base));
    });

    return affines;
}
