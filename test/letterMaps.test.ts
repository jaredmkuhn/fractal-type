import { BASE_MAPS, type CapitalLetters } from '../src/common/letterMaps';
import { generateLetter } from '../src/common/affineHelpers';

describe('BASE_MAPS Existence', () => {
    test('contains at least 3 AffineTransform2D entries in total', () => {
        let totalTransforms = 0;

        Object.values(BASE_MAPS).forEach((transforms) => {
            if (transforms) {
                totalTransforms += transforms.length;
            }
        });

        expect(totalTransforms).toBeGreaterThanOrEqual(3);
    });
    test('BASE_MAPS produce valid affine transforms', () => {
        Object.keys(BASE_MAPS).forEach((k) => {
            const key = k as CapitalLetters;
            const map = BASE_MAPS[key];
            if (!map) return;
            expect(() => {
                generateLetter(key);
            }).not.toThrow();
            const affine = generateLetter(key);
            expect(affine).toBeDefined();
            expect(affine.length).toEqual(map.length);
        });
    });
});
