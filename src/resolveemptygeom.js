import { implantation } from "./helpers/implantation.js";
import { isemptygeom } from "./helpers/isemptygeom.js";

/**
 * @function resolveemptygeom
 * @description Resolve undefined features of a geoJSON. The `resolveemptygeom()` function replace all features with undefined geometries by a valid geometry, but without coordinates
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object
 * @param {string} [options.defaultype = "Point"] - type of geometry to use for undefined features if this cannot be determined
 * @example
 * geotoolbox.resolveemptygeom(*a geojson*)
 */
export function resolveemptygeom(
  data,
  { defaultype = "Point", deepcopy = true } = {}
) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let type;
  switch (implantation(geojson)) {
    case 1:
      type = "Point";
      break;
    case 2:
      type = "LineString";
      break;
    case 3:
      type = "Polygon";
      break;
    default:
      type = defaultype;
  }

  geojson.features.map(
    (d) =>
      (d.geometry = isemptygeom(d.geometry)
        ? { type: type, coordinates: [] }
        : d.geometry)
  );

  return geojson;
}
