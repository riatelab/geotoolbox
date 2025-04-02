import { check } from "./helpers/check.js";
import { aggregate } from "./aggregate.js";
/**
 * @function nodes
 * @summary Retrieve geometry nodes
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

  if (["Feature", "Geometry"].includes(handle.type)) {
    result = aggregate(result);
  }
  return handle.export(result);
}
