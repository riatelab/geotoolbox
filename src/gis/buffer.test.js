import { buffer } from "./buffer";
import world from '../../testing/world.json';

describe('gis>buffer module', () => {
    it('calculate fixed buffers around FeatureCollection of polygons', () => {
        const fc = buffer(world, { dist: 300, step: 8 })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(209);
    })
    it('calculate field-derived buffers around FeatureCollection of polygons', () => {
        const fc = buffer(world, { dist: "distance", wgs84: true })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(209);
    })
    it('calculate single, merged buffer around FeatureCollection of polygons', () => {
        const fc = buffer(world, { dist: 300, merge: true })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })
})