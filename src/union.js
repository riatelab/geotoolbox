import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";

/**
 * @function union
 * @summary Merge geometries
 * @description Based on `geos.GEOSUnaryUnion`.
 * @param {object} options - Optional parameters
 * @param {string} [id] - The id of the features to merge
 * @example
 * geotoolbox.union(*a geojson*)
 */

export async function union(data, { id } = {}) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);

  // Union by id
  if (id !== undefined) {
    //   const ids = [...new Set(x.features.map((d) => d?.properties[id]))];
    //   let features = [];
    //   ids.forEach((d) => {
    //     const geosGeom = geojsonToGeosGeom(d, geos);
    //     const newGeom = geos.GEOSUnaryUnion(geosGeom);
    //     features.push({
    //       type: "Feature",
    //       properties: { id: d },
    //       geometry: geosGeomToGeojson(newGeom, geos),
    //     });
    //     geos.GEOSFree(geosGeom);
    //     geos.GEOSFree(newGeom);
    //   });
    //   x.features = features;
  }
  // Union All
  else {
    const geosGeom = geojsonToGeosGeom(x, geos);
    const newGeom = geos.GEOSUnaryUnion(geosGeom);
    x.features = [
      {
        type: "Feature",
        properties: {},
        geometry: geosGeomToGeojson(newGeom, geos),
      },
    ];
    geos.GEOSFree(geosGeom);
    geos.GEOSFree(newGeom);
  }

  return handle.export(x);
}
