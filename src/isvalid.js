import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";

/**
 * @function isvalid
 * @summary Check validity of a geoJSON. The `isvalid()` function is a [`geos-wasm`](https://chrispahm.github.io/geos-wasm/) operator. It returns an array of objects with the following keys:
- **`isvalid`** (`geos.GEOSisValid`): Check the validity of the provided geometry. Returns: number - 1 on true, 0 on false, 2 on exception.
- **`reason`** (`geos.GEOSisValidReason`): Return the human readable reason a geometry is invalid, "Valid Geometry" string otherwise, or NULL on exception.
- **`simple`** (`geos.GEOSisSimple`): Tests whether the input geometry is "simple". Mostly relevant for linestrings. A "simple" linestring has no self-intersections. Returns: 1 on true, 0 on false, 2 on exception.
- **`ring`** (`geos.GEOSisRing`): Tests whether the input geometry is a ring. Rings are linestrings, without self-intersections, with start and end point being identical. Returns: 1 on true, 0 on false, 2 on exception.
- **`closed`** (`geos.GEOSisClosed`): Tests whether the input geometry is closed. A closed geometry is a linestring or multilinestring with the start and end points being the same. Returns:  1 on true, 0 on false, 2 on exception
- If a feature's geometry is empty or do not contain geometries, then `undefined` is returned.
* @param {object} data - a GeoJSON FeatureCollection
 * @example
 * geotoolbox.isvalid(*a geojson*)
 */
export async function isvalid(data) {
  const geos = await initGeosJs();
  let result = [];
  data.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      result.push(undefined);
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      if (geos.GEOSisEmpty(geosGeom)) {
        result.push(undefined);
      } else {
        result.push({
          isvalid: geos.GEOSisValid(geosGeom),
          reason: geos.GEOSisValidReason(geosGeom),
          simple: geos.GEOSisSimple(geosGeom),
          ring: geos.GEOSisRing(geosGeom),
          closed: geos.GEOSisClosed(geosGeom),
        });
      }
      geos.GEOSFree(geosGeom);
    }
  });
  return result;
}
