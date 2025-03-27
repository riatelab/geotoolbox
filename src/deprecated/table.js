/**
 * @function properties/remove
 * @deprecated
 * @summary From now on, use directly `geojson.features.map(d => d.properties)`
 */
export function table(geojson) {
  return JSON.parse(JSON.stringify(geojson.features.map((d) => d.properties)));
}
