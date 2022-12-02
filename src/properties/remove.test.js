import { remove } from "./remove";
import world from '../../testing/world.json';

describe('properties>remove module', () => {
    it('keeps only non-specified columns from feature properties', () => {
        const fc = remove({
            x: world,
            field: ["ISO3", "NAMEfr", "name", "pop", "gdp", "year"]
        })
        expect(fc).toBeFeatureCollection();
        for (const feature of fc.features) {
            expect(Object.keys(feature.properties).sort()).toEqual(["gdppc", "id", "NAMEen", "region"].sort());
        }
    })
})