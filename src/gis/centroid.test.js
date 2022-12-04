import { centroid } from "./centroid";
import world from '../../testing/world.json';

describe('gis>centroid module', () => {
    it('calculate fixed buffers around FeatureCollection of polygons', () => {
        const fc = centroid(world)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(209);
        for (const feature of fc.features) {
            expect(feature.geometry.type).toEqual("Point")
        }
    })
})