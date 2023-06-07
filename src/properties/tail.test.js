import { tail } from "./tail";
import world from '../../testing/world.json';

describe('properties>tail module', () => {
    it('takes bottom 5 features from a FeatureCollection based on an expression', () => {
        const fc = tail({
            x: world,
            field: "gdp",
            nb: 5
        })
        expect(fc).toBeFeatureCollection();
        expect(fc.features[0].properties.ISO3).toEqual("TUV");
        expect(fc.features.length).toEqual(5);
    })
})