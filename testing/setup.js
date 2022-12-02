expect.extend({
    toBeFeatureCollection(received) {
        if (typeof received !== "object") { 
            return {
                pass: false,
                message: () => `Expected Object`,
            };
        } else {
            if ('type' in received && received.type === 'FeatureCollection') {
                if ('features' in received && received.features.length) {
                    return {
                        pass: true,
                        message: () => `Expected Object to have key "type" equal to "FeatureCollection" and key "features" to be an array`,
                    };
                } else {
                    return {
                        pass: false,
                        message: () => `Expected Object to have key "features" to be an array`,
                    };
                }
            } else {
                return {
                    pass: false,
                    message: () => `Expected Object to have key "type" equal to "FeatureCollection"`,
                };
            }
        }
    },
    toBeFeature(received) {
        const regex = /\b(?:Point|LineString|Polygon|MultiPoint|MultiPolygon)\b/gi;
        if (typeof received !== "object") { 
            return {
                pass: false,
                message: () => `Expected Object`,
            };
        } else {
            if ('type' in received && received.type === 'Feature') {
                if ('properties' in received && typeof received.properties === "object") {
                    if ('geometry' in received && typeof received.geometry === "object") {
                        if ('type' in received.geometry && received.geometry.type.match(regex)) {
                            if ('coordinates' in received.geometry && received.geometry.coordinates.length) {
                                return {
                                    pass: true,
                                    message: () => `Expected Object to contain "type" equal to "Feature", "properties" to be an object and "geometry" to be an object containing "type" equal to Point|LineString|Polygon|MultiPoint|MultiPolygon and "coordinates" to be an array`,
                                };
                            } else {
                                return {
                                    pass: false,
                                    message: () => `Expected Geometry Object to have key "coordinates" to be an array`,
                                };
                            }
                        } else {
                            return {
                                pass: false,
                                message: () => `Expected Geometry Object to have key "type" to be Point|LineString|Polygon|MultiPoint|MultiPolygon`,
                            };
                        }
                    } else {
                        return {
                            pass: false,
                            message: () => `Expected Object to have key "geometry" to be an object`,
                        };
                    }
                } else {
                    return {
                        pass: false,
                        message: () => `Expected Object to have key "properties" to be an object`,
                    };
                }
            } else {
                return {
                    pass: false,
                    message: () => `Expected Object to have key "type" equal to "Feature"`,
                };
            }
        }
    }
});