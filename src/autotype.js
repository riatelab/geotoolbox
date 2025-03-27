import { isgeojson, isarrayofobjects } from "./helpers/helpers";
import { autoType } from "d3-dsv";
const d3 = Object.assign({}, { autoType });

/**
 * @function autotype
 * @summary The function detects common data types such as numbers, dates and booleans, and convert properties values to the corresponding JavaScript type. Besed on d3.autoType().
 * @param {object|Array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {boolean} [options.mutate = false] - Use true to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.autotype(*a geojson or an array of objects*)
 */
export function autotype(data, { mutate = false } = {}) {
  let x = data;
  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }
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
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}
