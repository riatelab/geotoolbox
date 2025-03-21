/**
 * @module Properties
 */

/**
 * Return the attribute table of the GeoJSON FeatureCollection
 * (i.e. the properties of each Feature).
 * This function returns a deep copy of the original properties.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object} geojson - The targeted GeoJSON FeatureCollection
 * @returns {object[]} - The attribute table
 *
 */
export function table(geojson, { deepcopy = true } = {}) {
  return JSON.parse(JSON.stringify(geojson.features.map((d) => d.properties)));
}
