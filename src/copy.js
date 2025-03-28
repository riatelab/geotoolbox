/**
 * @function copy
 * @summary Deep copy
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @example
 * geotoolbox.copy(*a geojson or an array of objects*)
 */
export function copy(data) {
  return structuredClone(data);
}
