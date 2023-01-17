/**
 * Remove one or several columns in the attribute table.
 * This function returns a new object and does not modify the initial object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string|string[]} obj.field - The name of the field(s) to be removed
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @see the <code>keep</code> function to keep only the specified fields
 *
 * @example
 * geo.remove({
 *     x: world,
 *     field: ["tmp", "FID"],
 * }):
 *
 */
export function remove({ x, field }) {
  let data = [...x.features.map((d) => ({ ...d.properties }))];
  data.forEach((d) => {
    if (Array.isArray(field)) {
      field.forEach((e) => delete d[e]);
    } else {
      delete d[field];
    }
  });
  let output = JSON.parse(JSON.stringify(x));
  output.features.map((d, i) => (d.properties = { ...data[i] }));
  return output;
}
