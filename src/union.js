import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";

/**
 * @function union
 * @summary Merge geometries
 * @description Based on `geos.GEOSUnaryUnion`.
 * @param {object} options - Optional parameters
 * @param {string} [id] - The id of the features to merge
 * @param {boolean} [options.mutate = false] - Use true to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.union(*a geojson*)
 */

export async function union(data, { id, mutate = false } = {}) {
  // deep copy ?
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  const geos = await initGeosJs();

  // Union by id
  if (id !== undefined) {
    const ids = [...new Set(x.features.map((d) => d?.properties[id]))];

    let features = [];
    ids.forEach((d) => {
      let selection = {
        type: "FeatureCollection",
        features: x.features.filter((e) => e.properties[id] == d),
      };
      const geosGeom = geojsonToGeosGeom(selection, geos);
      const newGeom = geos.GEOSUnaryUnion(geosGeom);
      features.push({
        type: "Feature",
        properties: { id: d },
        geometry: geosGeomToGeojson(newGeom, geos),
      });
      geos.GEOSFree(geosGeom);
      geos.GEOSFree(newGeom);
    });
    x.features = features;
  }
  // Union All
  else {
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

  return x;
}
