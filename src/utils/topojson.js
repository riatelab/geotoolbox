/**
 * Convert a geoJSON in topoJSON
 *
 * @param {object} x - The GeoJSON FeatureCollection
 *
 */

import { topology } from "topojson-server";

export function topojson(x) {
  return topology({ x });
}
