import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";

/**
 * @function largestemptycircle
 * @summary Constructs the "largest empty circle" (LEC) for a set of obstacle geometries and within a polygonal boundary, with accuracy to to a specified distance tolerance. The obstacles may be any collection of points, lines and polygons.
 * @description Based on `geos.GEOSLargestEmptyCircle()`.
 * @param {object} data - A GeoJSON FeatureCollection.
 * @param {object} options - Optional parameters.
 * @param {GeoJSON} [options.boundary = null] - The area to contain the LEC center (may be null or empty)
 * @param {number} [options.tolerance = undefined] - Stop the algorithm when the search area is smaller than this toleranc
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.largestemptycircle()
 */

// DO NOT WORK !

export async function largestemptycircle(
  obstacles,
  { boundary, tolerance, mutate = false } = {}
) {
  let x;
  if (!mutate) {
    console.log("!mutate");
    x = JSON.parse(JSON.stringify(obstacles));
  } else {
    x = obstacles;
    console.log("mutate");
  }

  const geos = await initGeosJs();
  const geosobstacles = geojsonToGeosGeom(obstacles, geos);
  const geoboundary = geojsonToGeosGeom(boundary, geos);
  const output = geos.GEOSLargestEmptyCircle(
    geosobstacles,
    geoboundary,
    tolerance
  );
  let result = geosGeomToGeojson(output, geos);
  geos.GEOSFree(geosobstacles);
  geos.GEOSFree(geoboundary);
  geos.GEOSFree(output);

  x.features = [{ type: "Feature", properties: {}, geometry: result }];
  return x;
}
