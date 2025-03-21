/**
 * Retrieve geometry nodes
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/buffer?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */

import { featurecollection } from "../featurecollection.js";

export function nodes(x) {
  x = featurecollection(x);
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

  // return features;
  return { type: "FeatureCollection", features: features.flat() };
}
