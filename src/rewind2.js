import { check } from "./helpers/check.js";

/**
 * @function rewind2
 * @summary Rewind a geoJSON (Mapbox). The function allows to rewind the winding order of a GeoJSON object. The winding order of a polygon is the order in which the vertices are visited by the path that defines the polygon. The winding order of a polygon is significant because it determines the interior of the polygon. The winding order of a polygon is typically either clockwise or counterclockwise.
 * @description  Adapted from MapBox geojson-rewind code (https://github.com/mapbox/grojson-rewind) under ISC license.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @property {boolean} [options.outer = false] - rewind Rings Outer
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * geotoolbox.rewind2(*a geojson*)
 */

export function rewind2(data, { outer = false } = {}) {
  const handle = check(data);
  let geo = handle.import(data);

  for (let i = 0; i < geo.features.length; i++) {
    if (geo.features[i].geometry.type === "Polygon") {
      rewindRings(geo.features[i].geometry.coordinates, outer);
    } else if (geo.features[i].geometry.type === "MultiPolygon") {
      for (let j = 0; j < geo.features[i].geometry.coordinates.length; j++) {
        rewindRings(geo.features[i].geometry.coordinates[j], outer);
      }
    }
  }
  return handle.export(geo);
}

function rewindRings(rings, outer) {
  if (rings.length === 0) return;
  rewindRing(rings[0], outer);
  for (let i = 1; i < rings.length; i++) {
    rewindRing(rings[i], !outer);
  }
}

function rewindRing(ring, dir) {
  let tArea = 0;
  let err = 0;
  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    const k = (ring[i][0] - ring[j][0]) * (ring[j][1] + ring[i][1]);
    const m = tArea + k;
    err += Math.abs(tArea) >= Math.abs(k) ? tArea - m + k : k - m + tArea;
    tArea = m;
  }
  if (tArea + err >= 0 !== !!dir) ring.reverse();
}
