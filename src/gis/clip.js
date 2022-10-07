import * as jsts from "jsts/dist/jsts"; // ICI AMELIORER LES DEPENDANCES
import { featurecollection } from "../helpers/featurecollection.js";

export function clip(x, options = {}) {
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(featurecollection(x));

  let buffer = options.buffer ? options.buffer : 0.0000001;

  let clip = "test"; //  ICI TODO le rectangle du monde
  if (options.clip != null && options.clip != undefined) {
    clip = reader.read(options.clip);
  }

  // clip union
  let geomclip = clip.features[0].geometry;
  for (let i = 1; i < clip.features.length; i++) {
    geomclip = geomclip.union(clip.features[i].geometry);
  }
  geomclip = geomclip.buffer(buffer); // ICI METTRE BUFFER EN KM

  // Intersection
  let result = [];

  data.features.forEach((d) => {
    let geom = new jsts.io.GeoJSONWriter().write(
      d.geometry.intersection(geomclip)
    );

    if (geom.coordinates[0].length !== 0) {
      result.push({
        type: "Feature",
        properties: d.properties,
        geometry: geom,
      });
    }
  });

  return {
    type: "FeatureCollection",
    features: result,
  };
}
