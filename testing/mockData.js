export const pointsFeatures = [
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

export const pointsGeometries = pointsFeatures.map(f => f.geometry)

export const pointsFeatureCollection = {
    type: "FeatureCollection",
    features: pointsFeatures
}