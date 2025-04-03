import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";

/**
 * @function envelope
 * @summary Returns a "concave hull" of a geometry. A concave hull is a polygon which contains all the points of the input, but is a better approximation than the convex hull to the area occupied by the input. Frequently used to convert a multi-point into a polygonal area. that contains all the points in the input Geometry.
 * @description Based on `geos.GEOSConcaveHull()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * await geotoolbox.envelope(*a geojson*)
 */
export async function envelope(data) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);
  const geosgeom = geojsonToGeosGeom(x, geos);
  const output = geos.GEOSEnvelope(geosgeom);
  let result = geosGeomToGeojson(output, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(output);
  return handle.export({
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: {}, geometry: result }],
  });
}
