import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function dedupe
 * @summary Deletes duplicates. Keeps the first element.
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {number} [options.key] - id to consider
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.dedupe(*a geojson or an array of objects*, {key: "ISO3"})
 */

export function dedupe(data, { key, mutate = false } = {}) {
  let x = data;

  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }

    const values = [...new Set(x.features.map((d) => d?.properties[key]))];
    let arr = [];
    values.forEach((e) => {
      arr.push(x.features.find((d) => d?.properties[key] == e));
    });
    x.features = arr;
  } else if (isarrayofobjects(x)) {
    const values = [...new Set(x.map((d) => d[key]))];

    let arr = [];
    values.forEach((e) => {
      arr.push(x.find((d) => d[key] == e));
    });

    x = arr;
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}
