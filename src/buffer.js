//import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { getGeos } from "./helpers/geosmanager.js";
import { meter2deg } from "./utils/meter2deg.js";

export function buffer(
  data,
  { quadsegs = 8, isProjected = false, distance = 0 } = {},
  geos
) {
  let x = JSON.parse(JSON.stringify(data));

  // const geos = getGeos();
  const geosgeom = geojsonToGeosGeom(x, geos);
  const buffer = geos.GEOSBuffer(geosgeom, distance, quadsegs);
  let output = geosGeomToGeojson(buffer, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(buffer);
  x.features = [{ type: "Feature", properties: {}, geometry: output }];
  return x;
}
