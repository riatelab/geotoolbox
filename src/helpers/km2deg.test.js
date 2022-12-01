import { km2deg } from "./km2deg";

describe('helpers>km2deg module', () => {
    it('converts 100 km to 0.899 degrees', () => {
        expect(km2deg(100)).toBe(0.899320363724538);
    })
})