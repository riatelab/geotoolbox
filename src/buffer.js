import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";

export async function buffer(
  geos,
  data,
  { quadsegs = 8, isProjected = false, distance = 0 } = {}
) {
  if (!geos) {
    throw new Error("GEOS is not loaded");
  }

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
