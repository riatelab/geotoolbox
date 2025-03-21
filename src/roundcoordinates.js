import { parse } from "geojson-precision";

/**
 * @function roundcoordinates
 * @description Round coordinates. The `round()` function allows to round coordinates. This reduces file size and speeds up display.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.precision = 2] - The minimal distance between nodes
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.roundcoordinates(*a geojson*, {precision: 2})
 */
export function roundcoordinates(
  data,
  { precision = 2, deepcopy = true } = {}
) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  return parse(geojson, precision);
}
