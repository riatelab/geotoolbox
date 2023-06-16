import jsts from "jsts/dist/jsts.min.js";
import { featurecollection } from "../utils/featurecollection.js";

export function densify(x, options = {}) {
  // Parameters
  let distance = options.distance ? options.distance : 1;
  let reader = new jsts.io.GeoJSONReader();
  let writer = new jsts.io.GeoJSONWriter();
  let data = reader.read(featurecollection(x));

  let features = [];
  data.features.forEach((d) => {
    let dens = jsts.densify.Densifier.densify(d.geometry, distance);
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
