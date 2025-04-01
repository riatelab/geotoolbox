import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";

/**
 * @function concavehull
 * @summary Returns a "concave hull" of a geometry. A concave hull is a polygon which contains all the points of the input, but is a better approximation than the convex hull to the area occupied by the input. Frequently used to convert a multi-point into a polygonal area. that contains all the points in the input Geometry.
 * @description Based on `geos.GEOSConcaveHull()`.
 * @param {object} data - A GeoJSON FeatureCollection.
 * @param {object} options - Optional parameters.
 * @param {boolean} [options.ratio = 0] - The edge length ratio value, between 0 and 1.
 * @param {boolean} [options.holes = true] - When non-zero, the polygonal output may contain holes.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.concavehull(*a geojson*, {ratio: 0.5})
 */

export async function concavehull(
  data,
  { ratio = 0, holes = true, mutate = false } = {}
) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  const geos = await initGeosJs();
  const geosgeom = geojsonToGeosGeom(x, geos);
  const output = geos.GEOSConcaveHull(geosgeom, ratio, holes ? 1 : 0);
  let result = geosGeomToGeojson(output, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(output);

  x.features = [{ type: "Feature", properties: {}, geometry: result }];
  return x;
}
