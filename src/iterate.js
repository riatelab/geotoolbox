import { isgeojson, isarrayofobjects } from "./helpers/helpers.js";

/**
 * @function iterate
 * @summary Iterate and apply a function
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {function} [options.func = d => d] - A function to apply to each feature.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @example
 * // A simple example. Rename and select fields.
 * await geo.iterate(*a geojson*, {
  func: (d) => ({
    ...d
    properties: { id: d.properties.ISO3, pop: d.properties.population },
  })
})
* // Another example with a geojson and an async function
* await geo.iterate(*a geojson*, {
  func: async (d) => ({
    ...d,
    geometry: await geo.buffer(d.geometry, { dist: d.properties.size })
  })
 */

export async function iterate(data, { func = (d) => d, mutate = false } = {}) {
  let x = data;
  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }
    x.features = await Promise.all(
      x.features.map((d) => Promise.resolve(func(d)))
    );
  } else if (isarrayofobjects(x)) {
    x = await Promise.all(x.map((d) => Promise.resolve(func(d))));
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}
