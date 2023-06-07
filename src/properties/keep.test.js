import { keep } from "./keep";
import world from '../../testing/world.json';

describe('properties>keep module', () => {
    it('keeps only 3 columns from feature properties', () => {
        const fc = keep({
            x: world,
            field: ["ISO3", "NAMEen", "pop"]
        })
        expect(fc).toBeFeatureCollection();
        for (const feature of fc.features) {
            expect(Object.keys(feature.properties).sort()).toEqual(["ISO3", "NAMEen", "pop"]);
        }
    })
})