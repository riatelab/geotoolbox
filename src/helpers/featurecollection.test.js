import { featurecollection } from "./featurecollection";
import { pointsFeatures, pointsGeometries } from '../../testing/mockData';

describe('helpers>featurecollection module', () => {
    it('converts array of features to a FeatureCollection', () => {
        const fc = featurecollection(pointsFeatures)
        expect(fc).toBeFeatureCollection();
        for (const feature of fc.features) {
            expect(feature).toBeFeature();
        }
    })
    it('converts array of geometries to a FeatureCollection', () => {
        const fc = featurecollection(pointsGeometries)
        expect(fc).toBeFeatureCollection();
        for (const feature of fc.features) {
            expect(feature).toBeFeature();
        }
    })
})