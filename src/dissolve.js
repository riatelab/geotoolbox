import { geoArea } from "d3-geo";
import { check } from "./helpers/check.js";
/**
 * @function dissolve
 * @summary Multi part to single part geometries. The `disolve()` function allows to convert "MultiPoint", "MultiLineString" or "MultiPolygon" to single "Point", "LineString" or "Polygon". In addition, a `__share` field is calculated, representing the surface share of each part.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geome
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`)
 * @example
 * geotoolbox.dissolve(*a geojson*)
 */

export function dissolve(data) {
  const handle = check(data);
  let x = handle.import(data);

  let result = [];
  x.features.forEach((d) => {
    result.push(sp(d));
  });

  const keys = Object.keys(x).filter((e) => e != "features");
  const obj = {};
  keys.forEach((d) => {
    obj[d] = x[d];
  });
  obj.features = result.flat();

  return handle.export(obj);
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
