import initGeosJs from "../../node_modules/geos-wasm/build/package/geos.esm.js";

export async function test() {
  const geos = await initGeosJs();
  const reader = geos.GEOSWKTReader_create();
  const wkt = "POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))";
  const geomPtr = geos.GEOSWKTReader_read(reader, wkt);
  const areaPtr = geos.Module._malloc(8);
  geos.GEOSArea(geomPtr, areaPtr);
  const area = geos.Module.getValue(areaPtr, "double");
  return area;
}
