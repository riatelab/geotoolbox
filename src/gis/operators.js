import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { featurecollection } from "../utils/featurecollection.js";

export let op = {
  contains,
  covers,
  crosses,
  coveredby,
  disjoint,
  equals,
  intersects,
  overlaps,
  touches,
  within,
};

// Contains
async function contains(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSContains(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// Covers
async function covers(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSCovers(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// Crosses
async function crosses(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSCrosses(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// disjoint
async function disjoint(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSDisjoint(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// coveredby
async function coveredby(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSCoveredBy(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// equal
async function equals(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSEquals(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// intersects
async function intersects(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSIntersects(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// overlaps
async function overlaps(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSOverlaps(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// touches
async function touches(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSTouches(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

// within
async function within(g1, g2) {
  const geos = await initGeosJs();
  return result(
    geos.GEOSWithin(
      geojsonToGeosGeom(featurecollection(g1), geos),
      geojsonToGeosGeom(featurecollection(g2), geos)
    )
  );
}

function result(d) {
  let m = new Map([
    [-1, undefined],
    [0, false],
    [1, true],
  ]);
  return m.get(d);
}
