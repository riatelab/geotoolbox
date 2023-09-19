import initGeosJs from "../../node_modules/geos-wasm/build/package/geos.esm.js";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";

export async function geosunion(x) {
  const geos = await initGeosJs();

  const geosGeom = await geojsonToGeosGeom(x);

  const newGeom = await geos.GEOSUnaryUnion(geosGeom);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: geosGeomToGeojson(newGeom),
      },
    ],
  };
}
