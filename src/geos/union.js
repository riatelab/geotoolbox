import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { km2deg } from "../utils/km2deg.js";
import { featurecollection } from "../utils/featurecollection.js";

export async function union(x, options = {}) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();

  x = featurecollection(x);

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

    return {
      type: "FeatureCollection",
      features,
    };
  } else {
    const geosGeom = geojsonToGeosGeom(x, geos);
    const newGeom = geos.GEOSUnaryUnion(geosGeom);

    return featurecollection(geosGeomToGeojson(newGeom, geos));
  }
}
