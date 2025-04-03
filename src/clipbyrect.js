import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";
import { geosloader } from "./helpers/geos.js";

/**
 * @function clipbyrect
 * @summary Intersection optimized for a rectangular clipping polygon. By default, the function cuts off anything that exceeds the Earth's bbox.
 * @description Based on `geos.GEOSClipByRect()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {array} [options.bbox = [90, 180, -90, -180]] - Coordinates of the bbox [top, right, bottom, left].
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.clipbyrect(*a geojson*, {bbox:[50, 50, -50, -50]})
 */
export async function clipbyrect(data, { bbox = [90, 180, -90, -180] } = {}) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);
  const geosgeom = geojsonToGeosGeom(x, geos);
  const newgeom = geos.GEOSClipByRect(
    geosgeom,
    bbox[3],
    bbox[2],
    bbox[1],
    bbox[0]
  );
  let result = geosGeomToGeojson(newgeom, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(newgeom);
  x.features = [{ type: "Feature", properties: {}, geometry: result }];
  return handle.export(x);
}
