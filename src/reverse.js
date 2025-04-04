import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers.js";
import { check } from "./helpers/check.js";

/**
 * @function reverse
 * @summary For geometries with coordinate sequences, reverses the order of the sequences. Converts CCW rings to CW. Reverses direction of LineStrings.
 * @description Based on `geos.GEOSReverse()`
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.geosreverse(*a geojson*)
 */

export async function reverse(data, { dist = 1, mutate = false } = {}) {
  const geos = await geosloader();
  const handle = check(data, mutate);
  let x = handle.import(data);

  x.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      d.geometry = undefined;
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom = geos.GEOSReverse(geosGeom, dist);
      const result = geosGeomToGeojson(newGeom, geos);
      d.geometry = result;
      geos.GEOSFree(geosGeom);
      geos.GEOSFree(newGeom);
      geos.GEOSFree(result);
    }
  });
  return handle.export(x);
}
