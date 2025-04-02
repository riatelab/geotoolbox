import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { geosloader } from "./helpers/geos.js";
import { check } from "./helpers/check.js";

export async function buffer(
  data,
  { quadsegs = 8, isProjected = false, distance = 0 } = {}
) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);
  const geosgeom = geojsonToGeosGeom(x, geos);
  const buffer = geos.GEOSBuffer(geosgeom, distance, quadsegs);
  let result = geosGeomToGeojson(buffer, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(buffer);
  return handle.export({
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: {}, geometry: result }],
  });
}
