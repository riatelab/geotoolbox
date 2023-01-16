import { remove } from "./remove.js";

/**
 * Keep only the specified fields in the attribute table of the GeoJSON FeatureCollection.
 * This function returns a new object and does not modify the initial object.
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string[]} obj.fields - The name of the fields to be kept
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @see the <code>remove</code> function to remove the specified fields
 *
 * @example
 * geo.keep({
 *     x: world,
 *     field: ["ISO3", "pop2020"],
 * })
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 */
export function keep({ x, fields }) {
  // Get all keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  // Fields to be removed
  let diff = keys.filter((k) => !fields.includes(k));
  return remove({ x, field: diff });
}
