/**
 * @function nodes
 * @description Retrieve geometry nodes
 * @param {object} options - Optional parameters
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.nodes(*a geojson*)
 */

export function nodes(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let features = [];

  geojson.features.forEach((d) => {
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
  geojson.features = features.flat();
  return geojson;
}
