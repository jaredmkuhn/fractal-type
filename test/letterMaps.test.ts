import { LETTER_MAPS } from '../src/common/letterMaps';

describe('LETTER_MAPS Integrity', () => {
    test('contains at least 3 AffineTransform2D entries in total', () => {
        let totalTransforms = 0;

        Object.values(LETTER_MAPS).forEach((transforms) => {
            if (transforms) {
                totalTransforms += transforms.length;
            }
        });

        expect(totalTransforms).toBeGreaterThanOrEqual(3);
    });
});
