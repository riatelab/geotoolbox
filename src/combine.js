import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function comine
 * @summary Get the first n Features. The function sort data and returns the nb first elements. If a field is selected, then the function returns the top values. If the entries are strings, then the alphabetic order is applied.
 * @param {object|array} data - An array containig several of GeoJSONs or arrays of objects
 * @param {object} options - Optional parameters
 * @param {boolean} [options.normalize = true] - Use true to ensure that all features have all properties.
 * @example
 * geotoolbox.head(*a geojson or an array of objects*)
 */
export function combine(data, { normalize = true } = {}) {
  if (data.every((x) => isgeojson(x))) {
    let features = JSON.parse(
      JSON.stringify(data.map((d) => d.features).flat())
    );
    if (normalize) {
      let prop = [
        ...new Set(features.map((d) => Object.keys(d.properties)).flat()),
      ];
      features.forEach((feature) => {
        prop.forEach((key) => {
          if (!(key in feature.properties)) {
            feature.properties[key] = undefined;
          }
        });
      });
    }

    return { type: "FeatureCollection", features };

    // xxx
  } else if (data.every((x) => isarrayofobjects(x))) {
    let output = JSON.parse(JSON.stringify(data.flat()));
    if (normalize) {
      let prop = [...new Set(output.map((d) => Object.keys(d)).flat())];
      output = output.map((obj) =>
        Object.fromEntries(prop.map((key) => [key, obj[key]]))
      );
    }
    return output;
  }
}
