import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";

/**
 * @function makevalid
 * @description The `makevalid()` function repair an invalid geometry. It returns a repaired geometry.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.makevalid(*a geojson*)
 */
export async function makevalid(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  const geos = await initGeosJs();

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
