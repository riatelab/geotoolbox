/**
 * Return the geometry type contained in a GeoJSON FeatureCollection
 *
 * @param {object} x - The GeoJSON FeatureCollection
 * @returns {object} - The number of dimensions of the geometries (1 for punctual, 2 for lineal, 3 for zonal and -1 for composite) and the types of the geometries ("Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon")
 *
 */

export function type(x) {
  let types = Array.from(new Set(x.features.map((d) => d.geometry.type)));
  let tmp = [];

  if (types.indexOf("Polygon") !== -1 || types.indexOf("MultiPolygon") !== -1) {
    tmp.push(3);
  }

  if (
    types.indexOf("LineString") !== -1 ||
    types.indexOf("MultiLineString") !== -1
  ) {
    tmp.push(2);
  }

  if (types.indexOf("Point") !== -1 || types.indexOf("MultiPoint") !== -1) {
    tmp.push(1);
  }

  let result = tmp.length == 1 ? tmp[0] : -1;

  return { dimension: result, types: types };
}
