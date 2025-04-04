/**
 * @function copy
 * @summary Deep copy
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @example
 * geotoolbox.copy(*a geojson or an array of objects*)
 */
export function copy(data, { mutatebydefault = false } = {}) {
  return structuredClone(data);
}
