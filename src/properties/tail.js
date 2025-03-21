/**
 * @module Properties
 */

/**
 * Get the last n Features of a GeoJSON FeatureCollection.
 * This function returns a new object and does not modify the initial object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string} obj.field - The name of the field to be returned
 * @param {number} obj.nb - The number of elements to be returned
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @see the <code>head</code> function to get the first n Features
 *
 * @example
 * geo.tail({
 *     x: world,
 *     field: "gdp",
 *     nb: 5,
 * })
 *
 */
export function tail({ x, field, nb = 10 }) {
  let features = [...x.features];
  features = features
    .filter((d) => d.properties[field] != "")
    .filter((d) => d.properties[field] != null)
    .filter((d) => d.properties[field] != undefined)
    .filter((d) => d.properties[field] != +Infinity)
    .filter((d) => d.properties[field] != -Infinity)
    .filter((d) => d.properties[field] != NaN);

  let head = features.sort(
    (a, b) => +a.properties[field] - +b.properties[field]
  );
  features = features.slice(0, nb);
  let output = JSON.parse(JSON.stringify(x));
  output.features = features;
  return output;
}
