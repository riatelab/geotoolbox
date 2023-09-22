import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { featurecollection } from "../utils/featurecollection.js";

/**
 * Takes a FeatureCollection or a set of Features or Geometries containing Polygons and merge them with GEOS-WASM.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/union?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 * @param {object} [options={}] - Optional parameters
 * @param {string} [options.id] - The id of the features to aggregate
 * @returns {{features: [{geometry:{}, type: string, properties: {}}], type: string}} - The new GeoJSON FeatureCollection
 *
 */
export async function union(x, options = {}) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();

  x = featurecollection(x);

  // keep properties
  let prop = { ...x };
  delete prop.features;

  // Union by id
  if (options.id != null && options.id != undefined) {
    let ids = Array.from(
      new Set(x.features.map((d) => d.properties[options.id]))
    );

    let features = [];
    ids.forEach((d) => {
      let selection = {
        type: "FeatureCollection",
        features: x.features.filter((e) => e.properties[options.id] == d),
      };

      const geosGeom = geojsonToGeosGeom(selection, geos);
      const newGeom = geos.GEOSUnaryUnion(geosGeom);
      features.push({
        type: "Feature",
        properties: { id: d },
        geometry: geosGeomToGeojson(newGeom, geos),
      });
    });
    return Object.assign(prop, { features });
  }
  // Union All
  else {
      const geosGeom = geojsonToGeosGeom(x, geos);
      const newGeom = geos.GEOSUnaryUnion(geosGeom);
    return Object.assign(prop, {
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: geosGeomToGeojson(newGeom, geos),
        },
      ],
    });
  }
}
