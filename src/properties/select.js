import { str2fun } from "./str2fun.js";

/**
 * Filter a GeoJSON FeatureCollection by its attribute table.
 * This function returns a new object and does not modify the initial object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string} obj.expression - The name of the field to be filtered
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @example
 * geo.select({
 *     x: world,
 *     expression: "pop2022 >= 100000",
 * })
 *
 */
export function select({ x, expression }) {
  let features = [...x.features];

  // Get keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  keys.forEach((d) => {
    expression = expression.replace(d, `d.properties.${d}`);
  });

  expression = "d => " + expression;

  let output = JSON.parse(JSON.stringify(x));
  output.features = features.filter(str2fun(expression));
  return output;
}
