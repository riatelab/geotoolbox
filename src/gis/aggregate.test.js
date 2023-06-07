import { aggregate } from "./aggregate";
import world from '../../testing/world.json';

describe('gis>aggregate module', () => {
    it('combines all features in a FeatureCollection into one feature', () => {
        const fc = aggregate(world)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })

    it('combines all features in a FeatureCollection into one feature per id', () => {
        const fc = aggregate(world, { id: "region" })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(6);
    })
})