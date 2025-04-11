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

// Check if a field of a dataframe is a number
export function isFieldNumber2(data, field) {
  const test = data.map((d) => isNumber(d[field]));
  const nb = test.filter((d) => d === true).length;
  return nb > test.length / 2 ? true : false;
}

// Che if geometry is empty
function isemptygeom(geometry) {
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
    // Vérifier si les coordonnées contiennent NaN, undefined ou null
    if (
      geometry.coordinates.every(
        (coord) => coord === null || coord === undefined || Number.isNaN(coord)
      )
    ) {
      return true;
    }
    return false;
  } else {
    return true;
  }
}

// Convert string to funcytion
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

// Get geom types
export function geomtypes(x) {
  let types = Array.from(
    new Set(
      x.features.filter((d) => d.geometry !== null).map((d) => d.geometry.type)
    )
  );

  return types;
}

export function isFeatureCollection(x) {
  if (
    !Array.isArray(x) &&
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

export function isTopology(x) {
  if (x?.type == "Topology" && !Array.isArray(x)) {
    return true;
  } else {
    return false;
  }
}

export function isFeatures(x) {
  if (
    Array.isArray(x) &&
    x.length > 0 &&
    x[0]?.hasOwnProperty("type") &&
    x[0]?.hasOwnProperty("properties") &&
    x[0]?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isFeature(x) {
  if (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    x?.hasOwnProperty("type") &&
    x?.hasOwnProperty("properties") &&
    x?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isGeometries(x) {
  if (
    Array.isArray(x) &&
    x.length > 0 &&
    x[0]?.hasOwnProperty("type") &&
    x[0]?.hasOwnProperty("coordinates")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isGeometry(x) {
  if (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    x?.hasOwnProperty("type") &&
    x?.hasOwnProperty("coordinates")
  ) {
    return true;
  } else {
    return false;
  }
}

export function isArrayOfObjects(x) {
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

export function isArrayOfCoords(x) {
  if (
    Array.isArray(x) &&
    x[0].length == 2 &&
    Array.isArray(x[0]) &&
    typeof x[0][0] !== "object" &&
    typeof x[0][1] !== "object"
  ) {
    return true;
  } else {
    return false;
  }
}

export function isTwoValues(x) {
  if (Array.isArray(x) && x.length == 2 && isNumber(x[0]) && isNumber(x[1])) {
    return true;
  } else {
    return false;
  }
}
