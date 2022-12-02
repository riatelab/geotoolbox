import { subset } from "./subset";
import world from '../../testing/world.json';

describe('properties>subset module', () => {
    it('takes features from a FeatureCollection based on a field and array of values', () => {
        const fc = subset({
            x: world,
            field: "ISO3",
            selection: ["USA", "CAN", "MEX"],
            inverse: false
        })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(3);
        expect(fc.features.map(d => d.properties.ISO3).sort()).toEqual(["USA", "CAN", "MEX"].sort());
    })
})