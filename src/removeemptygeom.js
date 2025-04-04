import { isemptygeom } from "./helpers/helpers";
import { check } from "./helpers/check.js";

/**
 * @function removeemptygeom
 * @summary The function remove all features with undefined geometries.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.removeemptygeom(*a geojson*)
 */
export function removeemptygeom(data) {
  const handle = check(data);
  let x = handle.import(data);

  let features = [];
  x.features.forEach((d) => {
    if (!isemptygeom(d.geometry)) {
      features.push(d);
    }
  });

  x.features = features;

  return handle.export(x);
}
