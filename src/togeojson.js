import { feature } from "topojson-client";
const topojson = Object.assign({}, { feature });
import { table2geo } from "./helpers/table2geo";
import {
  isTwoValues,
  isArrayOfCoords,
  isArrayOfObjects,
  isGeometry,
  isGeometries,
  isFeature,
  isFeatures,
  isFeatureCollection,
  isTopology,
} from "./helpers/helpers";

/**
 * @function togeojson
 * @summary Retrieve a FeatureCollection. The `featurecollection()` function allows to retrieve a FeatureCollection from a
 - a topoJSON ✅ 
- an array of features ✅ 
- a single feature ✅ 
- an array of geometries ✅ 
- a single geometry ✅ 
- an array of objects with coordinates (points) ✅
- an array coordinates (points) ✅ 
- a couple of coordinates (points) ✅
 * @param {object} data - A GeoJSON FeatureCollection
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
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * // Array of coordinates
 * geoclean.togeojson([
  [32.33, 45.66],
  [10, 10]
])
  *
 * // A geometry  
  * geoclean.togeojson({
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
   * geoclean.togeojson(*a JSON*, {lat: "lat", lon: "lon"})
   * 
   * // Data handling
   * geoclean.togeojson(*a geoJSON*, {
      filter: (d) => d.properties.pop2018 >= 200,
      properties: ["id", "capital", "pop2018"],
      rename: ["code", "name", "pop"
  })  
   *  
   * 
 */

export function togeojson(
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
    mutate = false,
  } = {}
) {
  lat = lat || latitude;
  lon = lon || longitude;
  coords = coords || coordinates;

  // deep copy ?
  let x;
  if (!mutate) {
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
