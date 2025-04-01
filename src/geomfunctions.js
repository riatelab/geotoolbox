import { togeojson } from "./togeojson.js";
import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "geos-wasm/helpers";

export async function area(g) {
  const geos = await initGeosJs();
  const geosgeom = geojsonToGeosGeom(togeojson(g), geos);

  const areaPtr = geos.Module._malloc(8);
  geos.GEOSArea(geosgeom, areaPtr);
  const area = geos.Module.getValue(areaPtr, "double");
  geos.GEOSFree(areaPtr);
  geos.GEOSFree(geosgeom);

  return area;
}
