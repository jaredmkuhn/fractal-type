import { generateLetter } from '../src/transforms/affineHelpers';
import { BASE_MAPS } from '../src/common/letterMaps';
import { type CapitalLetters } from '../src/common/interfaces';

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
});
