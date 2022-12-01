import { featurecollection } from "./featurecollection";

const features = [
    {
        "type": "Feature",
        "properties": {},
        "geometry": { "coordinates": [5.733502943936003, 45.2183935502749], "type": "Point" }
    },
    {
        "type": "Feature",
        "properties": {},
        "geometry": { "coordinates": [5.710347886246495, 45.23460384795601], "type": "Point" }
    },
    {
        "type": "Feature",
        "properties": {},
        "geometry": { "coordinates": [5.724254827802241, 45.20394241024951], "type": "Point" }
    }
]

const geometries = features.map(f => f.geometry)

describe('helpers>featurecollection module', () => {
    it('converts array of features to a FeatureCollection', () => {
        const fc = featurecollection(features)
        expect(fc).toEqual(expect.objectContaining({
            type: "FeatureCollection",
            features: expect.any(Array)
        }))
        expect(fc.features).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: "Feature",
                    properties: expect.any(Object),
                    geometry: expect.objectContaining({
                        type: "Point",
                        coordinates: expect.any(Array)
                    })
                })
            ])
        );
    })
    it('converts array of geometries to a FeatureCollection', () => {
        const fc = featurecollection(features)
        expect(fc).toEqual(expect.objectContaining({
            type: "FeatureCollection",
            features: expect.any(Array)
        }))
        expect(fc.features).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: "Feature",
                    properties: expect.any(Object),
                    geometry: expect.objectContaining({
                        type: "Point",
                        coordinates: expect.any(Array)
                    })
                })
            ])
        );
    })
})