import { parse } from "geojson-precision";

/**
 * @function roundcoordinates
 * @summary Round coordinates. The `round()` function allows to round coordinates. This reduces file size and speeds up display.
 * @description Based on `geojson-precision`.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.precision = 2] - The minimal distance between nodes
 * @param {boolean} [options.mutate = false] - Use true to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.roundcoordinates(*a geojson*, {precision: 2})
 */
export function roundcoordinates(data, { precision = 2, mutate = false } = {}) {
  // deep copy ?
  let geojson;
  if (!mutate) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  return parse(geojson, precision);
}
