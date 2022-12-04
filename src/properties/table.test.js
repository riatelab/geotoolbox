import { table } from "./table";
import world from '../../testing/world.json';

describe('properties>table module', () => {
    it('returns array of properties from a FeatureCollection', () => {
        const tab = table(world)
        expect(tab.length).toEqual(209);
        for (const row of tab) {
            expect(Object.keys(row).sort()).toEqual([
                "ISO3",
                "NAMEen",
                "NAMEfr",
                "gdp",
                "gdppc",
                "id",
                "name",
                "pop",
                "region",
                "year",
                "distance"
            ].sort());
        }
    })
})