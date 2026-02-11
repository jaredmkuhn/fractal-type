import { generateLetterForGrid, buildAffinesForGrid } from '../src/transforms/affineHelpers';
import { BASE_MAPS } from '../src/common/letterMaps';
import { GridBuilder } from '../src/transforms/gridBuilder';
import { generateLetter } from './utils/letterHelper';
import { CapitalLetters } from '../src/common/interfaces';

describe('affineHelpers', () => {
    const gridH = new GridBuilder('H');
    const sectionH = gridH.getSections()[0];
    test('generateLetter throws for non-letter input', () => {
        expect(() => {
            generateLetterForGrid({
                ...sectionH,
                letter: 'h' as CapitalLetters,
            });
        }).toThrow();
    });
    test('generateLetter produces valid affine transforms for a defined letter', () => {
        expect(BASE_MAPS['H']).toBeDefined();
        expect(() => {
            generateLetterForGrid(sectionH);
        }).not.toThrow();
        const affine = generateLetterForGrid(sectionH);
        expect(affine).toBeDefined();
        expect(affine.length).toEqual(BASE_MAPS['H']!.length);
    });

    describe('buildAffinesForGrid', () => {
        test(`Multi-Cell Grid ("HEEHE", 2 lines)`, () => {
            const gridMulti = new GridBuilder('HEEHE', 2);
            const CEL_H = gridMulti.getSections()[0].celSize.y;
            const GRID_W = 1 / 3;
            const GRID_H = 1 / 2;

            // Text length 5, lines 2 -> 3 columns, 2 rows
            const affines = buildAffinesForGrid(gridMulti);
            const sections = gridMulti.getSections();

            expect(sections.length).toBe(6);
            expect(sections[5].letter).toBeUndefined();

            const countH = generateLetter('H').length;
            const countE = generateLetter('E').length;
            const expectedTotal = countH * 2 + countE * 3;
            expect(affines.length).toEqual(expectedTotal);

            // Verify 'H' at 0,0 (First letter)
            const hUnit = generateLetter('H')[0];
            const hGrid = affines[0];
            expect(hGrid.t.x).toBeCloseTo(hUnit.t.x * GRID_W);
            expect(hGrid.t.y).toBeCloseTo(CEL_H);

            const offset = countH + countE + countE + countH;
            const lastEUnit = generateLetter('E')[0];
            const lastEGrid = affines[offset];

            expect(lastEGrid.t.x).toBeCloseTo(GRID_W);
            expect(lastEGrid.t.y).toBeCloseTo(lastEUnit.t.y * GRID_H + GRID_H);
        });

        test('Empty section handling', () => {
            const grid = new GridBuilder('HEEHE', 2);
            const affines = buildAffinesForGrid(grid);
            expect(affines.length).toBeGreaterThan(0);
        });
    });
});
