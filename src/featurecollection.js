import { feature } from "topojson-client";
const topojson = Object.assign({}, { feature });
import { table2geo } from "./helpers/table2geo";

/**
 * @function featurecollection
 * @description Retrieve a FeatureCollection. The `featurecollection()` function allows to retrieve a FeatureCollection from a
 - a topoJSON ✅ 
- an array of features ✅ 
- a single feature ✅ 
- an array of geometries ✅ 
- a single geometry ✅ 
- an array of objects with coordinates (points) ✅
- an array coordinates (points) ✅ 
- a couple of coordinates (points) ✅
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {string} [options.lat = undefined] - Field containing latitude coordinates. `lat`, `Lat`, `LAT`, `Latitude`, `latitude` are set by default.
 * @param {string} [options.latitude = undefined] - Field containing latitude coordinates. `lat`, `Lat`, `LAT`, `Latitude`, `latitude` are set by default.
 * @param {string} [options.lon = undefined] - Field containing longitude coordinates. `lon`, `Lon`, `LON`, `lng`, `Lng`, `LNG`, `Longitude`, `longitude` are set by default.
 * @param {string} [options.longitude = undefined] - Field containing longitude coordinates. `lon`, `Lon`, `LON`, `lng`, `Lng`, `LNG`, `Longitude`, `longitude` are set by default.
 * @param {string} [options.coords = undefined] - If the coordinates are in a single column, this also works.  The fields  `coords`, `coord`, `Coords`, `Coordinates`, `coordinates`, `Coordinate`, `coordinate` are set by default but, as previsously, you can specify in option with `coordinates` or `coords`.
 * @param {string} [options.coordinates = undefined] - If the coordinates are in a single column, this also works.  The fields  `coords`, `coord`, `Coords`, `Coordinates`, `coordinates`, `Coordinate`, `coordinate` are set by default but, as previsously, you can specify in option with `coordinates` or `coords`.
 * @param {boolean} [options.reperse = false] - If the latitude and longitude coordinates are inverted, you can use the `reverse = true`.
 * @param {Array} [options.properties = undefined] -  With the `properties` option, you can choose which fields you'd like to keep.
 * @param {Array} [options.rename = undefined] -  With the `rename` option, you can even rename them.
 * @param {function} [options.filter = undefined] - with `filter`, you can filter data.
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * // Array of coordinates
 * geoclean.featurecollection([
  [32.33, 45.66],
  [10, 10]
])
  *
 * // A geometry  
  * geoclean.featurecollection({
  type: "Polygon",
  coordinates: [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ]
})
  *
   * // An array of objects containing coordinates
   * geoclean.featurecollection(*a JSON*, {lat: "lat", lon: "lon"})
   * 
   * // Data handling
   * geoclean.featurecollection(*a geoJSON*, {
      filter: (d) => d.properties.pop2018 >= 200,
      properties: ["id", "capital", "pop2018"],
      rename: ["code", "name", "pop"
  })  
   *  
   * 
 */

export function featurecollection(
  data,
  {
    lat = undefined,
    lon = undefined,
    latitude = undefined,
    longitude = undefined,
    coords = undefined,
    coordinates = undefined,
    reverse = false,
    properties = undefined,
    rename = undefined,
    filter = undefined,
    deepcopy = true,
  } = {}
) {
  lat = lat || latitude;
  lon = lon || longitude;
  coords = coords || coordinates;

  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isFeatureCollection(x)) {
    // nothing to do
  } else if (isTopology(x)) {
    x = topojson.feature(x, Object.keys(x.objects)[0]);
  } else if (isFeatures(x)) {
    x = { type: "FeatureCollection", features: x };
  } else if (isFeature(x)) {
    x = { type: "FeatureCollection", features: [x] };
  } else if (isGeometries(x)) {
    x = {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: d,
      })),
    };
  } else if (isGeometry(x)) {
    x = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: x }],
    };
  } else if (isArrayOfObjects(x)) {
    x = table2geo(x, lat, lon, coords, reverse);
  } else if (isArrayOfCoords(x)) {
    x = {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: reverse
            ? [parseFloat(d[1]), parseFloat(d[0])]
            : [parseFloat(d[0]), parseFloat(d[1])],
        },
      })),
    };
  } else if (isTwoValues(x)) {
    x = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: x },
        },
      ],
    };
  }

  // Filter
  if (filter != undefined && typeof filter == "function") {
    x.features = x.features.filter(filter);
  }

  if (properties != undefined && Array.isArray(properties)) {
    // Rename ?
    if (
      rename != undefined &&
      Array.isArray(rename) &&
      rename.length == properties.length
    ) {
      // Select and rename properties
      const fields = properties.map((d, i) => [d, rename[i]]);
      x.features.forEach((d) => {
        d.properties = Object.fromEntries(
          fields.map((k) => [k[1], d?.properties[k[0]]])
        );
      });
    } else {
      // Select properties
      x.features.forEach((d) => {
        d.properties = Object.fromEntries(
          properties.map((k) => [k, d?.properties[k]])
        );
      });
    }
  }

  // Output
  return x;
}

// Helpers

function isFeatureCollection(x) {
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

function isTopology(x) {
  if (x?.type == "Topology" && !Array.isArray(x)) {
    return true;
  } else {
    return false;
  }
}

function isFeatures(x) {
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

function isFeature(x) {
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

function isGeometries(x) {
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

function isGeometry(x) {
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

function isArrayOfObjects(x) {
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

function isArrayOfCoords(x) {
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

function isTwoValues(x) {
  if (Array.isArray(x) && x.length == 2 && isNumber(x[0]) && isNumber(x[1])) {
    return true;
  } else {
    return false;
  }
}

function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    typeof value !== "boolean" &&
    isFinite(value)
  );
}
