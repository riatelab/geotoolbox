import { geosloader } from "./helpers/geos.js";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { check } from "./helpers/check.js";

/**
 * @function union
 * @summary Merge geometries
 * @description Based on `geos.GEOSUnaryUnion()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {number} [options.id] - An id to merge by id
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * await geotoolbox.union(*a geojson*)
 * await geotoolbox.union(*a geojson*, {id: "id"})
 */

export async function union(data, { id } = {}) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);

  if (id) {
    const ids = [...new Set(x.features.map((d) => d.properties[id]))].filter(
      (d) => !["", undefined, null, NaN, Infinity, -Infinity].includes(d)
    );
    const acessor = new Map(
      ids.map((d) => [
        d,
        {
          type: "FeatureCollection",
          features: x.features.filter((e) => e.properties[id] == d),
        },
      ])
    );

    x.features = await Promise.all(
      ids.map(async (d) => {
        const geosGeom = geojsonToGeosGeom(acessor.get(d), geos);
        const newGeom = geos.GEOSUnaryUnion(geosGeom);
        let feature = {
          type: "Feature",
          properties: { id: d },
          geometry: geosGeomToGeojson(newGeom, geos),
        };
        geos.GEOSFree(geosGeom);
        geos.GEOSFree(newGeom);
        return feature;
      })
    );
  } else {
    const geosGeom = geojsonToGeosGeom(x, geos);
    const newGeom = geos.GEOSUnaryUnion(geosGeom);
    x.features = [
      {
        type: "Feature",
        properties: {},
        geometry: geosGeomToGeojson(newGeom, geos),
      },
    ];
    geos.GEOSFree(geosGeom);
    geos.GEOSFree(newGeom);
  }

  x.name = "union";
  return handle.export(x);
}
