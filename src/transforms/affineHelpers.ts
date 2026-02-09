import { AffineTransform2D, BlockMap, IVector2D, type CapitalLetters } from '../common/interfaces';
import { BASE_MAPS } from '../common/letterMaps';

/**
 * Generates an array of affine transform maps for a given letter.
 * @param letter The letter to generate the affine transform maps for.
 * @returns An array of affine transform maps.
 * @throws {Error} if the letter is not found in the base maps.
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

/**
 * Builds an affine transform map from a block map.
 * Important: This operates on a unit square, where the upper-left corner is (0,0)
 *  and the lower-right corner is (1,1).
 * @param map The block map to convert.
 * @returns The affine transform map.
 * @throws {Error} if the block map is invalid (computed lower-right does not match
 *  the provided lower-right)
 */
function buildAffineMap(map: BlockMap): AffineTransform2D {
    const t: IVector2D = { x: map.ul.x, y: map.ul.y };
    const s: IVector2D = { x: map.ur.x - t.x, y: map.ll.y - t.y };
    const r: IVector2D = { x: map.ur.y - t.y, y: map.ll.x - t.x };

    const verify: IVector2D = {
        x: s.x + r.y + t.x,
        y: r.x + s.y + t.y,
    };
    if (verify.x !== map.lr.x || verify.y !== map.lr.y) {
        console.error(`Debug info: ${JSON.stringify({ s, r, t, map })}`);
        throw new Error(
            `Invalid affine map: ${JSON.stringify(map)}\nlower-right check failed, computed: ${JSON.stringify(verify)}`,
        );
    }
    return { s, r, t };
}
