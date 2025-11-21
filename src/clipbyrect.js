import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";
import { geosloader } from "./helpers/geos.js";

/**
 * @function clipbyrect
 * @summary Intersection optimized for a rectangular clipping polygon. By default, the function cuts off anything that exceeds the Earth's bbox.
 * @description Based on `geos.GEOSClipByRect()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {array} [options.bbox = [90, 180, -90, -180]] - Coordinates of the bbox [top, right, bottom, left].
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.clipbyrect(*a geojson*, {bbox:[50, 50, -50, -50]})
 */
export async function clipbyrect(
  data,
  { bbox = [90 - 0.01, 180 - 0.01, -90 + 0.01, -180 + 0.01] } = {}
) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);

  // On prépare un nouveau tableau de features
  const newFeatures = [];

  for (const f of x.features) {
    // Convertit la géométrie GeoJSON -> GEOSGeom
    const geosgeom = geojsonToGeosGeom(f.geometry, geos);

    // Clip rectangulaire : left, bottom, right, top  (ordre GEOS)
    const clipped = geos.GEOSClipByRect(
      geosgeom,
      bbox[3], // left
      bbox[2], // bottom
      bbox[1], // right
      bbox[0] // top
    );

    geos.GEOSFree(geosgeom);

    if (clipped) {
      const gj = geosGeomToGeojson(clipped, geos);
      geos.GEOSFree(clipped);

      // Filtrer le cas "empty geometry"
      if (gj && gj.type !== "GeometryCollection") {
        newFeatures.push({
          type: "Feature",
          properties: f.properties ?? {},
          geometry: gj,
        });
      }
    }
  }

  // Remplacer les features dans x
  x.features = newFeatures;
  x.name = "clipbyrect";

  return handle.export(x);
}
