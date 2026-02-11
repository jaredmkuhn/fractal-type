import { AffineTransform2D, BlockMap, GridSection, IVector2D } from '../common/interfaces';
import { BASE_MAPS } from '../common/letterMaps';
import { GridBuilder } from './gridBuilder';

export function buildAffinesForGrid(grid: GridBuilder): AffineTransform2D[] {
    const affines = new Array<AffineTransform2D>();
    const sections = grid.getSections();

    sections.forEach((section) => {
        if (!section.letter) {
            return;
        }
        affines.push(...generateLetterForGrid(section));
    });
    return affines;
}

/**
 * Generates the affine transforms for a given letter mapped to a grid in
 * a unit-square format
 * @param section
 * @returns an array of affine transforms mapped to the grid location
 */
export function generateLetterForGrid(section: GridSection): AffineTransform2D[] {
    if (!section.letter) {
        return [];
    }
    const baseMap = BASE_MAPS[section.letter];
    if (!baseMap) {
        throw new Error(`Unknown letter: ${section.letter}`);
    }
    const affines = new Array<AffineTransform2D>();
    baseMap.forEach((base) => {
        const rebase: BlockMap = rebaseBlockMap(base, section);
        affines.push(buildAffineMap(rebase));
    });
    return affines;
}

/**
 * Rebases a block map to a grid section in a unit-square format.
 * @param blockMap The block map to rebase.
 * @param section The grid section to rebase to.
 * @returns The rebased block map.
 */
function rebaseBlockMap(blockMap: BlockMap, section: GridSection): BlockMap {
    const rebaseMap: BlockMap = structuredClone(blockMap);
    Object.keys(blockMap).forEach((key) => {
        const k = key as keyof BlockMap;
        rebaseMap[k] = {
            x: blockMap[k].x * section.celSize.x + section.offset.x,
            y: blockMap[k].y * section.celSize.y + section.offset.y,
        };
    });
    return rebaseMap;
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
export function buildAffineMap(map: BlockMap): AffineTransform2D {
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
