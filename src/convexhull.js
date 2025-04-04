import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";

/**
 * @function convexhull
 * @summary Returns a "convex hull" of a geometry. The smallest convex Geometry that contains all the points in the input Geometry
 * @description Based on `geos.GEOSConvexHull()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * await geotoolbox.convexehull(*a geojson*)
 */

export async function convexhull(data) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);
  const geosgeom = geojsonToGeosGeom(x, geos);
  const output = geos.GEOSConvexHull(geosgeom);
  let result = geosGeomToGeojson(output, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(output);
  return handle.export({
    type: "FeatureCollection",
    name: "convexhull",
    features: [{ type: "Feature", properties: {}, geometry: result }],
  });
}
