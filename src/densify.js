import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";
import { check } from "./helpers/check.js";

/**
 * @function densify
 * @summary Densifies a geometry using a given distance tolerance
 * @description Based on `geos.GEOSDensify()`
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {number} [options.dist = 1] - The minimal distance between nodes
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.densify(*a geojson*, { dist:0.5 })
 */

export async function densify(data, { dist = 1, mutate = false } = {}) {
  const geos = await geosloader();
  const handle = check(data, mutate);
  let x = handle.import(data);

  x.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      d.geometry = undefined;
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom = geos.GEOSDensify(geosGeom, dist);
      const densiygeom = geosGeomToGeojson(newGeom, geos);
      d.geometry = densiygeom;
      geos.GEOSFree(geosGeom);
      geos.GEOSFree(newGeom);
      geos.GEOSFree(densiygeom);
    }
  });

  return handle.export(x);
}
