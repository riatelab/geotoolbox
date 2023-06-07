import { add } from "./add";
import world from '../../testing/world.json';

describe('properties>add module', () => {
    it('adds field to a FeatureCollection', () => {
        const fc = add({
            x: world,
            field: "gdppc",
            expression: "gdp/pop*1000"
        })
        expect(fc).toBeFeatureCollection();
        for (const feature of fc.features) {
            const props = feature.properties;
            expect(props.gdppc).toEqual(props.gdp / props.pop * 1000);
        }
    })
})