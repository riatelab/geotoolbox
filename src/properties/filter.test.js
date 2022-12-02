import { filter } from "./filter";
import world from '../../testing/world.json';

describe('properties>filter module', () => {
    it('filters a FeatureCollection based on an expression', () => {
        const fc = filter({
            x: world,
            expression: "pop >= 100000"
        })
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(185);
    })
})