// Check if a value is a number
export function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    typeof value !== "boolean" &&
    isFinite(value)
  );
}

// Check if a field of a geojson is a number
export function isFieldNumber(data, field) {
  const test = data.features.map((d) => isNumber(d.properties[field]));
  const nb = test.filter((d) => d === true).length;
  return nb > test.length / 2 ? true : false;
}

// Che if geometry is empty
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

// Convert string ti funcytion
export function str2fun(string) {
  const newfunc = new Function(`return (${string})`);
  return newfunc();
}

// Check if input is a geojson
export function isgeojson(x) {
  if (
    !Array.isArray(x) &&
    typeof x === "object" &&
    x?.type == "FeatureCollection" &&
    Array.isArray(x?.features) &&
    x?.features[0]?.hasOwnProperty("type") &&
    x?.features[0]?.hasOwnProperty("properties") &&
    x?.features[0]?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

// Check if input is a data frame
export function isarrayofobjects(x) {
  if (
    Array.isArray(x) &&
    !Array.isArray(x[0]) &&
    x.length > 0 &&
    typeof x[0] === "object"
  ) {
    return true;
  } else {
    return false;
  }
}

// export function isgeojson(data) {
//   return (
//     value !== null &&
//     value !== "" &&
//     typeof value !== "boolean" &&
//     isFinite(value)
//   );
// }

// Get geom types
export function geomtypes(x) {
  let types = Array.from(
    new Set(
      x.features.filter((d) => d.geometry !== null).map((d) => d.geometry.type)
    )
  );

  return types;
}
