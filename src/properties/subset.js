/**
 * Create a subset from an array of values.
 * This function returns a new object and does not modify the initial object.
 *
 * @param {object} obj - An object with the following properties
 * @param {object} obj.x - The targeted GeoJSON FeatureCollection
 * @param {string} obj.field - The name of the field on which the subset is based
 * @param {string[]} obj.selection - The values to be selected
 * @param {boolean} [obj.inverse=false] - If true, the selection is inverted
 * @returns {object} - The new GeoJSON FeatureCollection
 *
 * @example
 * geo.subset({
 *     x: world,
 *     field: "ISO3",
 *     selection: ["USA", "CAN", "MEX"],
 *     inverse: false,
 * })
 */
export function subset({ x, field, selection, inverse = false }) {
  let features = [...x.features];
  selection = !Array.isArray(selection) ? [selection] : selection;

  if (inverse) {
    selection = Array.from(
      new Set(features.map((d) => d.properties[field]))
    ).filter((d) => !selection.includes(d));
  }
  let result = [];

  selection.forEach((e) => {
    result.push(features.filter((d) => d.properties[field] == e));
  });

  let output = JSON.parse(JSON.stringify(x));
  output.features = result.flat();
  return output;
}
