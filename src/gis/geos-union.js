import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";

export async function geosunion(x) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance 
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();
  const geosGeom = geojsonToGeosGeom(x, geos);
  const newGeom = geos.GEOSUnaryUnion(geosGeom);
  
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: geosGeomToGeojson(newGeom, geos),
      },
    ],
  };
}
