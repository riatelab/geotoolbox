import { geoStitch } from "d3-geo-projection";
import { check } from "./helpers/check.js";

/**
 * @function stitch
 * @summary The `stitch()` function returns a shallow copy of the specified GeoJSON object, removing antimeridian and polar cuts, and replacing straight Cartesian line segments with geodesic segments. The input object must have coordinates in longitude and latitude in decimal degrees per RFC 7946. Antimeridian cutting, if needed, can then be re-applied after rotating to the desired projection aspect.
 * @description Based on `d3.geoStitch()`.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * geotoolbox.stitch(*a geojson*)
 */

export function stitch(data) {
  const handle = check(data);
  let x = handle.import(data);
  x = geoStitch(x);
  x.name = "stitch";
  return handle.export(x);
}
