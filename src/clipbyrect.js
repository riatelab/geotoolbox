import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { geosloader } from "./helpers/geos.js";
export async function clipbyrect(data, { bbox = [90, 180, -90, -180] } = {}) {
  const geos = await geosloader();
  let x = JSON.parse(JSON.stringify(data));
  const geosgeom = geojsonToGeosGeom(x, geos);
  const newgeom = geos.GEOSClipByRect(
    geosgeom,
    bbox[3],
    bbox[2],
    bbox[1],
    bbox[0]
  );
  let output = geosGeomToGeojson(newgeom, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(newgeom);
  x.features = [{ type: "Feature", properties: {}, geometry: output }];
  return x;
}
