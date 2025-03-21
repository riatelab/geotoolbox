import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/isemptygeom.js";

/**
 * @function densify
 * @description Densify a geoJSON. The function add nodes to a geoJSON with GEOS-WASM.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.dist = 1] - The minimal distance between nodes
 * @param {boolean} [options.copy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.densify(*a geojson*, { dist:0.5 })
 */

export async function densify(data, { dist = 1, deepcopy = true } = {}) {
  const geos = await initGeosJs();

  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  geojson.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      d.geometry = undefined;
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom = geos.GEOSDensify(geosGeom, dist);
      const densiygeom = geosGeomToGeojson(newGeom, geos);
      d.geometry = densiygeom;
      geos.GEOSFree(geosGeom);
      geos.GEOSFree(newGeom);
      geos.GEOSFree(densiygeom);
    }
  });

  return geojson;
}
