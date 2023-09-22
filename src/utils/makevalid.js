import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { featurecollection } from "./featurecollection.js";

/**
 * Returns a geoJSON which is valid according to the GEOS validity rules, and preserves as much as possible of the input geometry's extent, dimension, and structure.
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */
export async function makevalid(x) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around

  const geos = await initGeosJs();
  x = featurecollection(x);
  const geosGeom = geojsonToGeosGeom(x, geos);
  const newGeom = geos.GEOSMakeValid(geosGeom);
  const validgeom = geosGeomToGeojson(newGeom, geos).geometries;
  x.features.forEach((d, i) => (d.geometry = validgeom[i]));
  return x;
}
