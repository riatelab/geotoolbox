import { togeojson } from "./togeojson.js";
import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "geos-wasm/helpers";

export let op = {
  contains,
  covers,
  crosses,
  disjoint,
  coveredby,
  equals,
  intersects,
  overlaps,
  touches,
  within,
};

/**
 * @function op/contains
 * @summary Tests if geometry g2 is completely within g1, but not wholly contained in the boundary of g1.
 * @description Based on `geos.GEOSContains` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.contains(*a geojson*, *another geojson*)
 */
async function contains(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSContains(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/covers
 * @summary GEOSCovers. Tests if geometry g1 covers g2, which is the case if every point of g2 lies in g1.
 * @description Based on `geos.GEOSCovers` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.covers(*a geojson*, *another geojson*)
 */
async function covers(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCovers(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/crosses
 * @summary GEOSCrosses. Tests if two geometries interiors intersect but their boundaries do not. Most useful for finding line crosses cases.
 * @description Based on `geos.GEOSCrosses` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.crosses(*a geojson*, *another geojson*)
 */
async function crosses(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCrosses(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/disjoint
 * @summary GEOSDisjoint. Tests if two geometries have no point in common.
 * @description Based on `geos.GEOSDisjoint` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.disjoint(*a geojson*, *another geojson*)
 */
async function disjoint(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSDisjoint(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/coveredby
 * @summary GEOSCoveredBy. Tests if geometry g1 is covered by g2, which is the case if every point of g1 lies in g2.
 * @description Based on `geos.GEOSCoveredBy` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.coveredby(*a geojson*, *another geojson*)
 */
async function coveredby(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSCoveredBy(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/equals
 * @summary GEOSEquals. Tests if two geometries contain the same set of points in the plane.
 * @description Based on `geos.GEOSEquals` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.equals(*a geojson*, *another geojson*)
 */
async function equals(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSEquals(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/intersects
 * @summary GEOSIntersects. Tests if two geometries intersect.
 * @description Based on `geos.GEOSIntersects` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.intersects(*a geojson*, *another geojson*)
 */
async function intersects(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSIntersects(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/overlaps
 * @summary GEOSOverlaps. Tests if two geometries share interiors but are neither within nor contained.
 * @description Based on `geos.GEOSOverlaps` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.overlaps(*a geojson*, *another geojson*)
 */
async function overlaps(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSOverlaps(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/touches
 * @summary GEOSTouches. Tests if two geometries share boundaries at one or more points, but do not have interior points in common.
 * @description Based on `geos.GEOSTouches` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.touches(*a geojson*, *another geojson*)
 */
async function touches(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSTouches(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

/**
 * @function op/within
 * @summary GEOSWithin. Tests if geometry g1 is completely within g2, but not wholly contained in the boundary of g2.
 * @description Based on `geos.GEOSWithin` (geos-wasm)
 * @param {object} g1 - a GeoJSON FeatureCollection
 * @param {object} g2 - a GeoJSON FeatureCollection
 * @example
 * geottolbox.op.within(*a geojson*, *another geojson*)
 */
async function within(g1, g2) {
  const geos = await initGeosJs();
  const geosgeom1 = geojsonToGeosGeom(togeojson(g1), geos);
  const geosgeom2 = geojsonToGeosGeom(togeojson(g2), geos);
  const test = geos.GEOSWithin(geosgeom1, geosgeom2);
  geos.GEOSFree(geosgeom1);
  geos.GEOSFree(geosgeom2);
  return result(test);
}

function result(d) {
  let m = new Map([
    [-1, undefined],
    [0, false],
    [1, true],
  ]);
  return m.get(d);
}
