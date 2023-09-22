import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { featurecollection } from "../utils/featurecollection.js";

export async function clip(x, options = {}) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();
  x = featurecollection(x);

  // keep properties
  let prop = { ...x };
  delete prop.features;

  // Clip
  let myclip;
  if (options.clip != null && options.clip != undefined) {
    myclip = featurecollection(options.clip);
  } else {
    let delta = 0.00001;
    myclip = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-180 + delta, 90 - delta],
                [180 - delta, 90 - delta],
                [180 - delta, -90 + delta],
                [-180 + delta, -90 + delta],
                [-180 + delta, 90 - delta],
              ],
            ],
          },
        },
      ],
    };
  }

  //let clip = featurecollection(options.clip);
  clip = geos.GEOSUnaryUnion(geojsonToGeosGeom(myclip, geos));
  //return geosGeomToGeojson(clip, geos);

  let result = [];
  x.features.forEach((d) => {
    const geosGeom = geojsonToGeosGeom(d, geos);
    const newGeom = geos.GEOSIntersection(geosGeom, clip);
    result.push({
      type: "Feature",
      properties: d.properties,
      geometry: geosGeomToGeojson(newGeom, geos),
    });
  });

  return Object.assign(prop, {
    features: result,
  });
}
