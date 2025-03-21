export function isemptygeom(geometry) {
  if (
    typeof geometry == "object" &&
    [
      "Point",
      "LineString",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
    ].includes(geometry?.type) &&
    Array.isArray(geometry?.coordinates) &&
    geometry?.coordinates.length !== 0
  ) {
    return false;
  } else {
    return true;
  }
}
