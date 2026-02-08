import { generateLetter } from '../src/common/affineHelpers';
import { BASE_MAPS, type CapitalLetters } from '../src/common/letterMaps';

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
