import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function columns
 * @summary Select, rename and reorder properties
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {array} [options.keys ] - Properties to keep
 * @param {array} [options.rename] - Properties to rename
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.columns(*a geojson or an array of objects*, {keys: ["ISO3","Population"]", rename:["id","pop"]})
 */

export function columns(data, { keys, rename, mutate = false } = {}) {
  let x = data;
  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }
    if (
      rename != undefined &&
      Array.isArray(rename) &&
      rename.length == keys.length
    ) {
      // Select and rename properties
      const fields = keys.map((d, i) => [d, rename[i]]);
      x.features.forEach((d) => {
        d.properties = Object.fromEntries(
          fields.map((k) => [k[1], d?.properties[k[0]]])
        );
      });
    } else if (keys !== undefined && Array.isArray(keys)) {
      // Select properties
      x.features.forEach((d) => {
        d.properties = Object.fromEntries(
          keys.map((k) => [k, d?.properties[k]])
        );
      });
    }
  } else if (isarrayofobjects(x)) {
    if (
      rename != undefined &&
      Array.isArray(rename) &&
      rename.length == keys.length
    ) {
      const fields = keys.map((d, i) => [d, rename[i]]);
      x = x.map((d) => Object.fromEntries(fields.map((k) => [k[1], d[k[0]]])));
    } else if (keys !== undefined && Array.isArray(keys)) {
      x = x.map((d) => Object.fromEntries(keys.map((k) => [k, d[k]])));
    }

    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }

  return x;
}
