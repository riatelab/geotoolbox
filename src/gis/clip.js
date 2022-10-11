//import * as jsts from "jsts/dist/jsts";
import { union } from "./union.js";
import { io } from "jsts/dist/jsts";
const jsts = Object.assign({}, { io });

import { featurecollection } from "../helpers/featurecollection.js";

export function clip(x, options = {}) {
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(featurecollection(x));

  let buffer = options.buffer ? options.buffer : 0.0000001;

  let clip = null;
  if (options.clip != null && options.clip != undefined) {
    clip = reader.read(options.clip);
  } else {
    let delta = 0.00001;
    clip = reader.read({
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
    });
  }

  // clip union
  let geomclip = clip.features[0].geometry;
  for (let i = 1; i < clip.features.length; i++) {
    geomclip = geomclip.union(clip.features[i].geometry);
  }
  geomclip = geomclip.buffer(buffer);

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
