import { implantation } from "./helpers/implantation.js";
import { geomtypes } from "./helpers/helpers";
import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";

/**
 * @function info
 * @summary GeoJSON information. The function gives some informations about a geoJSON (size, number of nodes, type of features, etc)
 * @async
 * @param {object} data - A GeoJSON FeatureCollection
 * @example
 * geottolbox.info(*a geojson*)
 */

export async function info(data) {
  const weight = (
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    }).size / 1024
  ).toFixed(0);

  const nodes =
    data.features
      .map((d) => d.geometry.coordinates)
      .flat(4)
      .filter((d) => d !== undefined).length / 2;
  0;

  const accessor = new Map([
    [1, "point"],
    [2, "line"],
    [3, "poly"],
  ]);

  const type = implantation(data);

  const geos = await geosloader();
  let diagnostic = [];
  data.features.forEach((d, i) => {
    if (isemptygeom(d?.geometry)) {
      diagnostic.push({ index: i, isValid: 0, reason: "empty" });
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      if (geos.GEOSisEmpty(geosGeom)) {
        diagnostic.push({ index: i, isValid: 0, reason: "empty" });
      } else {
        diagnostic.push({
          index: i,
          isValid: geos.GEOSisValid(geosGeom),
          reason: geos.GEOSisValidReason(geosGeom),
        });
      }
      geos.GEOSFree(geosGeom);
    }
  });

  diagnostic = diagnostic.filter((d) => d.isValid == 0);
  diagnostic = diagnostic.length == 0 ? "Valid Geometries" : diagnostic;

  return {
    type: accessor.get(type),
    geometries: geomtypes(data),
    diagnostic,
    properties: [
      ...new Set(data?.features.map((d) => Object.keys(d?.properties)).flat()),
    ],
    weight: "~" + weight + " KO",
    nodes,
  };
}
