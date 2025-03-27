import { geoStitch } from "d3-geo-projection";

/**
 * @function stitch
 * @summary The `stitch()` function returns a shallow copy of the specified GeoJSON object, removing antimeridian and polar cuts, and replacing straight Cartesian line segments with geodesic segments. The input object must have coordinates in longitude and latitude in decimal degrees per RFC 7946. Antimeridian cutting, if needed, can then be re-applied after rotating to the desired projection aspect.
 * @description Based on `d3.geoStitch`.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.mutate = false] - Use true to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.stitch(*a geojson*)
 */

export function stitch(data, { mutate = false } = {}) {
  // deep copy ?
  let geojson;
  if (!mutate) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  return geoStitch(geojson);
}
