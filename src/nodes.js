import { check } from "./helpers/check.js";
/**
 * @function nodes
 * @summary Retrieve geometry nodes
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.nodes(*a geojson*)
 */

export function nodes(data) {
  const handle = check(data);
  let x = handle.import(data);

  let features = [];

  x.features.forEach((d) => {
    let n = d.geometry.coordinates.flat(Infinity);
    let f = [];
    for (let i = 0; i < n.length; i = i + 2) {
      f.push({
        type: "Feature",
        properties: d.properties,
        geometry: { type: "Point", coordinates: [n[i], n[i + 1]] },
      });
    }
    features.push(f);
  });

  let result = {
    type: "FeatureCollection",
    features: features.flat(),
  };

  return handle.export(result);
}
