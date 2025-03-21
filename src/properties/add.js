// Add
import { str2fun } from "../helpers/str2fun.js";

/**
 * @module Properties
 */

/**
 * Add a new field in the attribute table of the GeoJSON FeatureCollection.
 * This function returns a new object and does not modify the initial object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string} obj.field - The name of the new field
 * @param {string} obj.expression - The expression, as a string, to compute the new field
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @example
 * geo.add({
 *     x: world,
 *     field: "gdppc",
 *     expression: "gdp/pop*1000",
 * })
 *
 *
 */
export function add({ x, field, expression }) {
  let data = [...x.features.map((d) => ({ ...d.properties }))];

  // Get keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  keys.forEach((d) => {
    expression = expression.replace(d, `d.${d}`);
  });

  expression = "d=> " + expression;

  let newfield = data.map(str2fun(expression));
  // let newfield = data.map((d) => d.pop / d.gdp);

  data.forEach((d, i) => {
    d = Object.assign(d, { [field]: newfield[i] });
  });

  let output = JSON.parse(JSON.stringify(x));
  output.features.map((d, i) => (d.properties = { ...data[i] }));
  return output;
}
