import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function table
 * @summary Retrieves the dataset's attribute table (properties). By default, a deep copy is returned.
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.table(*a geojson or an array of objects*)
 */

export function table(data, { mutate = false } = {}) {
  let x;
  if (!mutate) {
    x = structuredClone(data);
  } else {
    x = data;
  }
  if (isgeojson(x)) {
    return x?.features.map((d) => d?.properties);
  }
  if (isarrayofobjects(x)) {
    return x;
  }
}
