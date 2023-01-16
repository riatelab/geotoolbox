import { featurecollection } from "./featurecollection.js";

/**
 * Return the geometry type contained in a GeoJSON FeatureCollection / an array of Features / an array of Geometries.
 *
 * @param {object|array} x - The GeoJSON FeatureCollection / array of Features / array of Geometries
 * @returns {string} - The type of the geometries, between "point", "line", "poly" and "composite" (when different types of geometries are encountered)
 */
export function type(x) {
  let figuration = ["poly", "line", "point"];
  let types = featurecollection(x).features.map((d) => d.geometry.type);
  types = Array.from(new Set(types));
  let tmp = [];

  if (types.indexOf("Polygon") !== -1 || types.indexOf("MultiPolygon") !== -1) {
    tmp.push(figuration[0]);
  }

  if (
    types.indexOf("LineString") !== -1 ||
    types.indexOf("MultiLineString") !== -1
  ) {
    tmp.push(figuration[1]);
  }

  if (types.indexOf("Point") !== -1 || types.indexOf("MultiPoint") !== -1) {
    tmp.push(figuration[2]);
  }

  let result = tmp.length == 1 ? tmp[0] : "composite";
  return result;
}
