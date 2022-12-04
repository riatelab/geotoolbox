import { bbox } from "./bbox";
import world from '../../testing/world.json';
import { pointsFeatureCollection } from '../../testing/mockData';

const RUS = {
    type: "FeatureCollection",
    features: [world.features.find(d => d.properties.ISO3 === 'RUS')]
}

describe('gis>bbox module', () => {
    it('get spherical bbox from FeatureCollection of polygons', () => {
        const fc = bbox(RUS)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })
    it('get spherical bbox from FeatureCollection of points', () => {
        const fc = bbox(pointsFeatureCollection)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })
})