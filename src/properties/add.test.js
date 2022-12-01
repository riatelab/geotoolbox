import { add } from "./add";

const featureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { a: 2 },
            geometry: { coordinates: [5.733502943936003, 45.2183935502749], type: "Point" }
        },
        {
            type: "Feature",
            properties: { a: 4 },
            geometry: { coordinates: [5.710347886246495, 45.23460384795601], type: "Point" }
        },
        {
            type: "Feature",
            properties: { a: 6 },
            geometry: { coordinates: [5.724254827802241, 45.20394241024951], type: "Point" }
        }
    ]
}

describe('properties>add module', () => {
    it('adds field to a FeatureCollection', () => {
        const fc = add({
            x: featureCollection,
            field: "a_squared",
            expression: "a**2"
        })
        fc.features.forEach(d => {
            const props = d.properties;
            console.log(props)
            expect(props.a_squared).toEqual(props.a ** 2)
        })
    })
})