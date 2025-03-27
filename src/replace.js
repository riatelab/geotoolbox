import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function replace
 * @summary Replace substrings. the function allows a string to be replaced by another string in the entire dataset
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {string} [options.search] - string to search for
 * @param {string} [options.replacement]  -substitute character string
 * @param {array} [options.keys] - an array of keys to limit replacement to certain fields
 * @param {boolean} [options.mutate = false] - Use true to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.replace(*a geojson or an array of objects*, {search: ",", replacement: " " })
 */

export function replace(
  data,
  { search = "", replacement = "", keys, mutate = false } = {}
) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isgeojson(x)) {
    x.features.forEach((d) => {
      replaceinobj(d.properties, search, replacement, keys);
    });
  } else if (isarrayofobjects(x)) {
    x.forEach((d) => {
      replaceinobj(d, search, replacement, keys);
    });
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}

function replaceinobj(obj, search, replacement, keys) {
  let entries = Object.entries(obj);
  if (keys !== undefined && Array.isArray(keys)) {
    entries = entries.filter((d) => keys.includes(d[0]));
  }
  entries.forEach(([key, value]) => {
    if (typeof value === "string") {
      obj[key] = value.replaceAll(search, replacement);
    }
  });
}
