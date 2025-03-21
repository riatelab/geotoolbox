import { geoStitch } from "d3-geo-projection";

/**
 * @function stitch
 * @description The `stitch()` function (aka `d3.geoStitch`) returns a shallow copy of the specified GeoJSON object, removing antimeridian and polar cuts, and replacing straight Cartesian line segments with geodesic segments. The input object must have coordinates in longitude and latitude in decimal degrees per RFC 7946. Antimeridian cutting, if needed, can then be re-applied after rotating to the desired projection aspect.

 * @param {object} data - a GeoJSON FeatureCollection
 * @example
 * geotoolbox.stitch(*a geojson*)
 */

export function stitch(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  return geoStitch(geojson);
}
