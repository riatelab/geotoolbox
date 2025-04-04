import { implantation } from "./helpers/implantation.js";
import { isemptygeom } from "./helpers/helpers";
import { check } from "./helpers/check.js";

/**
 * @function resolveemptygeom
 * @summary The function replace all features with undefined geometries by a valid geometry, but without coordinates
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {string} [options.defaultype = "Point"] - type of geometry to use for undefined features if this cannot be determined
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.resolveemptygeom(*a geojson*)
 */
export function resolveemptygeom(data, { defaultype = "Point" } = {}) {
  const handle = check(data);
  let x = handle.import(data);

  let type;
  switch (implantation(x)) {
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

  x.features.map(
    (d) =>
      (d.geometry = isemptygeom(d.geometry)
        ? { type: type, coordinates: [] }
        : d.geometry)
  );

  return handle.export(x);
}
