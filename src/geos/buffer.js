import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { km2deg } from "../utils/km2deg.js";
import { featurecollection } from "../utils/featurecollection.js";

export async function buffer(x, options = { dist: 0, quadsegs: 8 }) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();
  x = featurecollection(x);

  if (options.merge) {
    const geosGeom = geojsonToGeosGeom(x, geos);
    const newGeom = geos.GEOSBuffer(geosGeom, options.dist, options.quadsegs);
    return featurecollection(geosGeomToGeojson(newGeom, geos));
  } else {
    let buff = [];
    x.features.forEach((d) => {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom = geos.GEOSBuffer(geosGeom, options.dist, options.quadsegs);

      buff.push({
        type: "Feature",
        properties: d.properties,
        geometry: geosGeomToGeojson(newGeom, geos),
      });
    });

    buff = buff.filter((d) => d.geometry.coordinates != 0);

    // TODO
    // Corriger la fonction featurecollection pour ne pas avoir besoin de faire ca
    if (buff == 0) {
      return undefined;
    } else {
      return featurecollection(buff);
    }
  }
}
