import { border } from "./border";
import world from '../../testing/world.json';

describe('gis>border module', () => {
    it('get shared broders from FeatureCollection of polygons', () => {
        const fc = border(world)
        expect(fc).toBeFeatureCollection();
        expect(fc.features.length).toEqual(1);
    })
})