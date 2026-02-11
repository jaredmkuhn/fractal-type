import { generateLetter, buildAffinesForGrid } from '../src/transforms/affineHelpers';
import { BASE_MAPS } from '../src/common/letterMaps';
import { type CapitalLetters } from '../src/common/interfaces';
import { GridBuilder } from '../src/transforms/gridBuilder';

const TEST_W = 800;
const TEST_H = 600;

describe('affineHelpers', () => {
    test('generateLetter throws for non-letter input', () => {
        expect(() => {
            generateLetter('1' as CapitalLetters);
        }).toThrow();
    });
    test('generateLetter produces valid affine transforms for a defined letter', () => {
        expect(BASE_MAPS['H']).toBeDefined();
        expect(() => {
            generateLetter('H');
        }).not.toThrow();
        const affine = generateLetter('H');
        expect(affine).toBeDefined();
        expect(affine.length).toEqual(BASE_MAPS['H']!.length);
    });

    describe('buildAffinesForGrid', () => {
        test(`Standard Non-Square Check (${TEST_W}x${TEST_H}, "H")`, () => {
            const grid = new GridBuilder(TEST_W, TEST_H, 'H');
            const affines = buildAffinesForGrid(grid);
            const unitAffines = generateLetter('H');

            expect(affines.length).toEqual(unitAffines.length);

            // "H" is a single letter, so cell should be TEST_WxTEST_H at 0,0
            // Logic: s matches, r is skewed by aspect ratio, t scales
            const firstUnit = unitAffines[0];
            const firstGrid = affines[0];

            expect(firstGrid.s.x).toBeCloseTo(firstUnit.s.x);
            expect(firstGrid.s.y).toBeCloseTo(firstUnit.s.y);
            expect(firstGrid.t.x).toBeCloseTo(firstUnit.t.x * TEST_W);
            expect(firstGrid.t.y).toBeCloseTo(firstUnit.t.y * TEST_H);
        });

        test(`Multi-Cell Grid (${TEST_W}x${TEST_H}, "HEEHE", 2 lines)`, () => {
            const CEL_W = TEST_W / 3;
            const CEL_H = TEST_H / 2;

            // Text length 5, lines 2 -> 3 columns, 2 rows
            const grid = new GridBuilder(TEST_W, TEST_H, 'HEEHE', 2);
            const affines = buildAffinesForGrid(grid);
            const sections = grid.getSections();

            expect(sections.length).toBe(6);
            expect(sections[5].letter).toBeUndefined();

            const countH = generateLetter('H').length;
            const countE = generateLetter('E').length;
            const expectedTotal = countH * 2 + countE * 3;
            expect(affines.length).toEqual(expectedTotal);

            // Verify 'H' at 0,0 (First letter)
            const hUnit = generateLetter('H')[0];
            const hGrid = affines[0];
            expect(hGrid.t.x).toBeCloseTo(hUnit.t.x * CEL_W);
            expect(hGrid.t.y).toBeCloseTo(hUnit.t.y * CEL_H);

            const offset = countH + countE + countE + countH;
            const lastEUnit = generateLetter('E')[0];
            const lastEGrid = affines[offset];

            expect(lastEGrid.t.x).toBeCloseTo(lastEUnit.t.x * CEL_W + CEL_W);
            expect(lastEGrid.t.y).toBeCloseTo(lastEUnit.t.y * CEL_H + CEL_H);
        });

        test('Empty section handling', () => {
            const grid = new GridBuilder(TEST_W, TEST_H, 'HEEHE', 2);
            const affines = buildAffinesForGrid(grid);
            expect(affines.length).toBeGreaterThan(0);
        });
    });
});
