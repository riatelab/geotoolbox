/**
 * Return the attribute table of the GeoJSON FeatureCollection
 * (i.e. the properties of each Feature).
 * This function returns a deep copy of the original properties.
 *
 * @param {object} geojson - The targeted GeoJSON FeatureCollection
 * @returns {object[]} - The attribute table
 */
export function table(geojson) {
  return JSON.parse(JSON.stringify(geojson.features.map((d) => d.properties)));
}
