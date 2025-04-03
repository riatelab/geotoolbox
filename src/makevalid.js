import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";
import { check } from "./helpers/check.js";

/**
 * @function makevalid
 * @summary The `makevalid()` function repair an invalid geometry. It returns a repaired geometry.
 * @description Based on `geos.GEOSisValid()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * await geotoolbox.makevalid(*a geojson*)
 */
export async function makevalid(data) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);

  x.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      d.geometry = undefined;
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const validity = geos.GEOSisValid(geosGeom);

      if (validity != 1) {
        const newGeom = geos.GEOSMakeValid(geosGeom);
        d.geometry = geosGeomToGeojson(newGeom, geos);
        geos.GEOSFree(geosGeom);
        geos.GEOSFree(newGeom);
      }
    }
  });

  return handle.export(x);
}
