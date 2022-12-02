import { bbox } from "./bbox";
import world from '../../testing/world.json';

const RUS = {
    type: "FeatureCollection",
    features: [world.features.find(d => d.properties.ISO3 === 'RUS')]
}

describe('gis>bbox module', () => {
    it('get spherical bbox from FeatureCollection', () => {
        const fc = bbox(RUS)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })
})