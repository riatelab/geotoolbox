import { geoArea } from "d3-geo";

/**
 * @function dissolve
 * @description Multi part to single part geometries. The `disolve()` function allows to convert "MultiPoint", "MultiLineString" or "MultiPolygon" to single "Point", "LineString" or "Polygon". In addition, a `__share` field is calculated, representing the surface share of each part.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.dissolve(*a geojson*)
 */

export function dissolve(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let result = [];
  geojson.features.forEach((d) => {
    result.push(sp(d));
  });

  const keys = Object.keys(geojson).filter((e) => e != "features");
  const obj = {};
  keys.forEach((d) => {
    obj[d] = geojson[d];
  });
  obj.features = result.flat();

  return obj;
}

function sp(feature) {
  let result = [];

  if (feature?.geometry?.type?.includes("Multi")) {
    feature?.geometry?.coordinates.forEach((d) => {
      result.push({
        type: "Feature",
        properties: feature?.properties,
        geometry: {
          type: feature?.geometry?.type.replace("Multi", ""),
          coordinates: d,
        },
      });
    });
  } else {
    result.push({ ...feature });
  }

  const totalArea = geoArea(feature);
  result.forEach((d) => (d.__share = geoArea(d) / totalArea));

  return result;
}
