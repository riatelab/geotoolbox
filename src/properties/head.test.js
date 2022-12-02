import { head } from "./head";
import world from '../../testing/world.json';

describe('properties>head module', () => {
    it('takes top 5 features from a FeatureCollection based on an expression', () => {
        const fc = head({
            x: world,
            field: "gdp",
            nb: 5
        })
        expect(fc).toBeFeatureCollection();
        expect(fc.features[0].properties.ISO3).toEqual("USA");
        expect(fc.features.length).toEqual(5);
    })
})