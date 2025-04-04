import { parse } from "geojson-precision";
import { check } from "./helpers/check.js";

/**
 * @function roundcoordinates
 * @summary Round coordinates. The `round()` function allows to round coordinates. This reduces file size and speeds up display.
 * @description Based on `geojson-precision`.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {number} [options.precision = 2] - The minimal distance between nodes
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.roundcoordinates(*a geojson*, {precision: 2})
 */
export function roundcoordinates(data, { precision = 2 } = {}) {
  const handle = check(data);
  let x = handle.import(data);
  let result = parse(x, precision);
  return handle.export(result);
}
