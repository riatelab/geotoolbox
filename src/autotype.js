import { isgeojson, isarrayofobjects } from "./helpers/helpers";
import { autoType } from "d3-dsv";
const d3 = Object.assign({}, { autoType });

/**
 * @function autotype
 * @description Automatic type. The function detects common data types such as numbers, dates and booleans, and convert properties values to the corresponding JavaScript type. Besed on d3.autoType().
 * @param {object|Array} data - a GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.autotype(*a geojson or an array of objects*)
 */
export function autotype(data, { deepcopy = true } = {}) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isgeojson(x)) {
    x.features = x.features.map((d) => ({
      ...d,
      properties: d3.autoType(
        Object.fromEntries(
          Object.entries(d.properties).map(([key, value]) => [
            key,
            String(value),
          ])
        )
      ),
    }));
  } else if (isarrayofobjects(x)) {
    x = x.map((d) =>
      d3.autoType(
        Object.fromEntries(
          Object.entries(d).map(([key, value]) => [key, String(value)])
        )
      )
    );
  }
  return x;
}
