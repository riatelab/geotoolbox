import { geosloader } from "./helpers/geos.js";
import { togeojson } from "./togeojson.js";
import { geojsonToGeosGeom } from "geos-wasm/helpers";

/**
 * @function contains
 * @summary Tests if geometry g2 is completely within g1, but not wholly contained in the boundary of g1.
 * @description Based on `geos.GEOSContains()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.contains(*a geojson*, *another geojson*)
 */
export async function contains(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSContains(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function covers
 * @summary GEOSCovers. Tests if geometry g1 covers g2, which is the case if every point of g2 lies in g1.
 * @description Based on `geos.GEOSCovers()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.covers(*a geojson*, *another geojson*)
 */
export async function covers(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCovers(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function crosses
 * @summary GEOSCrosses. Tests if two geometries interiors intersect but their boundaries do not. Most useful for finding line crosses cases.
 * @description Based on `geos.GEOSCrosses()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.crosses(*a geojson*, *another geojson*)
 */
export async function crosses(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCrosses(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function disjoint
 * @summary GEOSDisjoint. Tests if two geometries have no point in common.
 * @description Based on `geos.GEOSDisjoint()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.disjoint(*a geojson*, *another geojson*)
 */
export async function disjoint(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSDisjoint(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function coveredby
 * @summary GEOSCoveredBy. Tests if geometry g1 is covered by g2, which is the case if every point of g1 lies in g2.
 * @description Based on `geos.GEOSCoveredBy()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.coveredby(*a geojson*, *another geojson*)
 */
export async function coveredby(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCoveredBy(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function equals
 * @summary GEOSEquals. Tests if two geometries contain the same set of points in the plane.
 * @description Based on `geos.GEOSEquals()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.equals(*a geojson*, *another geojson*)
 */
export async function equals(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSEquals(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function intersects
 * @summary GEOSIntersects. Tests if two geometries intersect.
 * @description Based on `geos.GEOSIntersects()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.intersects(*a geojson*, *another geojson*)
 */
export async function intersects(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSIntersects(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function overlaps
 * @summary GEOSOverlaps. Tests if two geometries share interiors but are neither within nor contained.
 * @description Based on `geos.GEOSOverlaps()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.overlaps(*a geojson*, *another geojson*)
 */
export async function overlaps(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSOverlaps(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function touches
 * @summary GEOSTouches. Tests if two geometries share boundaries at one or more points, but do not have interior points in common.
 * @description Based on `geos.GEOSTouches()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.touches(*a geojson*, *another geojson*)
 */
export async function touches(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSTouches(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function within
 * @summary GEOSWithin. Tests if geometry g1 is completely within g2, but not wholly contained in the boundary of g2.
 * @description Based on `geos.GEOSWithin()`
 * @param {object|array} g1 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object|array} g2 - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * geotoolbox.within(*a geojson*, *another geojson*)
 */
export async function within(g1, g2) {
  const geos = await geosloader();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSWithin(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function isvalid
 * @summary Check validity of a geoJSON.
 * @description Based on `geos.GEOSisValid()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {boolean} - A boolean value
 * @example
 * await geotoolbox.isvalid(*a geojson*)
 */
export async function isvalid(d) {
  const geos = await geosloader();
  const geosgeom = geojsonToGeosGeom(togeojson(d), geos);
  const test = geos.GEOSisValid(geosgeom);
  geos.GEOSFree(geosgeom);
  return result(test);
}

/**
 * @function isvalidreason
 * @summary Check validity of a geoJSON and give the reason.
 * @description Based on `geos.GEOSisValidReason()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @returns {string} - The reason
 * @example
 * await geotoolbox.isvalidreason(*a geojson*)
 */
export async function isvalidreason(d) {
  const geos = await geosloader();
  const geosgeom = geojsonToGeosGeom(togeojson(d), geos);
  const test = geos.GEOSisValidReason(geosgeom);
  geos.GEOSFree(geosgeom);
  return test;
}

function result(d) {
  let m = new Map([
    [-1, undefined],
    [0, false],
    [1, true],
  ]);
  return m.get(d);
}
