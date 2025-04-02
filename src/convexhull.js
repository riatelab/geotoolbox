import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";

/**
 * @function convexhull
 * @summary Returns a "convex hull" of a geometry. The smallest convex Geometry that contains all the points in the input Geometry
 * @param {object} data - A GeoJSON FeatureCollection.
 * @example
 * geotoolbox.convexehull(*a geojson*)
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
    features: [{ type: "Feature", properties: {}, geometry: result }],
  });
}
