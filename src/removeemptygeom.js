import { isemptygeom } from "./helpers/helpers";

/**
 * @function removeemptygeom
 * @description Relove undefined features of a geoJSON. The `removeemptygeom()` function remove all features with undefined geometries.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.removeemptygeom(*a geojson*)
 */
export function removeemptygeom(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let features = [];
  geojson.features.forEach((d) => {
    if (!isemptygeom(d.geometry)) {
      features.push(d);
    }
  });

  geojson.features = features;

  return geojson;
}
