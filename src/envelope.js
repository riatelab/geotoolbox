import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";

/**
 * @function envelope
 * @summary Returns a "concave hull" of a geometry. A concave hull is a polygon which contains all the points of the input, but is a better approximation than the convex hull to the area occupied by the input. Frequently used to convert a multi-point into a polygonal area. that contains all the points in the input Geometry.
 * @description Based on `geos.GEOSConcaveHull()`.
 * @param {object} data - A GeoJSON FeatureCollection.
 * @param {object} options - Optional parameters.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.envelope(*a geojson*)
 */

export async function envelope(data, { mutate = false } = {}) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  const geos = await initGeosJs();
  const geosgeom = geojsonToGeosGeom(data, geos);
  const output = geos.GEOSEnvelope(geosgeom);
  let result = geosGeomToGeojson(output, geos);
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(output);

  x.features = [{ type: "Feature", properties: {}, geometry: result }];
  return x;
}
