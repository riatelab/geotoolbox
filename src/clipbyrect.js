import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
export async function clipbyrect(
  geos,
  data,
  { bbox = [90, 180, -90, -180] } = {}
) {
  if (!geos) {
    throw new Error("GEOS n'est pas défini !");
  }
  let x = JSON.parse(JSON.stringify(data));
  //const geos = getGeos();
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
