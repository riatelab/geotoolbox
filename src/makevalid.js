import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";

/**
 * @function makevalid
 * @summary The `makevalid()` function repair an invalid geometry. It returns a repaired geometry.
 * @description Based on `geos.GEOSisValid` (geos-wasm).
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.makevalid(*a geojson*)
 */
export async function makevalid(data, { mutate = false } = {}) {
  // deep copy ?
  let geojson;
  if (!mutate) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  const geos = await geosloader();

  geojson.features.forEach((d) => {
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

  return geojson;
}
