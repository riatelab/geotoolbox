import Densifier from "jsts/org/locationtech/jts/densify/Densifier";
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter";
const jsts = {
  Densifier,
  GeoJSONReader,
  GeoJSONWriter,
};

//import jsts from "jsts/dist/jsts.min.js";

import { featurecollection } from "../utils/featurecollection.js";

export function densify2(x, options = {}) {
  // Parameters
  let distance = options.distance ? options.distance : 1;
  let reader = new jsts.GeoJSONReader();
  let writer = new jsts.GeoJSONWriter();
  let data = reader.read(featurecollection(x));

  let features = [];
  data.features.forEach((d) => {
    let dens = jsts.Densifier.densify(d.geometry, distance);
    dens = writer.write(dens);
    if (dens.coordinates[0].length !== 0) {
      features.push({
        type: "Feature",
        properties: d.properties,
        geometry: dens,
      });
    }
  });
  return { type: "FeatureCollection", features: features };
}
