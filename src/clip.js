import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/helpers";
import { check } from "./helpers/check.js";

/**
 * @function clip
 * @summary Clip a geometry with another
 * @description Based on `geos.GEOSIntersection() and geos.GEOSDifference()`.
 * @async
 * @param {object|array} data - data to be clipped. A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {object|array} [options.clip] - Clip. A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {boolean} [options.reverse = fase] - Use true to use `geos.GEOSDifference()` operator instead of `geos.GEOSIntersection()`.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.clip(*a geojson*, { clip: *another geojson* })
 */

export async function clip(data, { clip, reverse = false } = {}) {
  if (clip) {
    const geos = await geosloader();
    const handle = check(data);
    let x = handle.import(data);
    const geosClip = geos.GEOSUnaryUnion(
      geojsonToGeosGeom(check(clip).import(clip), geos)
    );

    let result = [];
    x.features.forEach((d) => {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom =
        reverse == true
          ? geos.GEOSDifference(geosGeom, geosClip)
          : geos.GEOSIntersection(geosGeom, geosClip);

      const geom = geosGeomToGeojson(newGeom, geos);

      if (!isemptygeom(geom)) {
        result.push({
          type: "Feature",
          properties: d.properties,
          geometry: geom,
        });
      }
      geos.GEOSFree(newGeom);
    });
    geos.GEOSFree(geosClip);

    const final = {
      type: "FeatureCollection",
      name: "clip",
      features: result,
    };
    final.name = "clip";
    return handle.export(final);
  } else {
    return data;
  }
}
