import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { featurecollection } from "../utils/featurecollection.js";

/**
 * Densify a geoJSON with GEOS-WASM
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/densify?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}} - The resulting GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} options.dist - The minimal distance between nodes
 *
 */
export async function densify(x, options = { dist: 1 }) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();
  x = featurecollection(x);

  const geosGeom = geojsonToGeosGeom(x, geos);
  const newGeom = geos.GEOSDensify(geosGeom, options.dist);
  const densiygeom = geosGeomToGeojson(newGeom, geos).geometries;

  x.features.forEach((d, i) => (d.geometry = densiygeom[i]));
  return x;
}
