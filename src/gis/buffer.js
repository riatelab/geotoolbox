//import * as jsts from "jsts/dist/jsts";

import { io } from "jsts/dist/jsts";
const jsts = Object.assign({}, { io });
import { clip } from "./clip.js";
import { km2deg } from "../helpers/km2deg.js";
import { union } from "./union.js";
import { featurecollection } from "../helpers/featurecollection.js";

// TODO : clip world extent

export function buffer(x, options = {}) {
  let distance = 0;
  switch (typeof options.dist) {
    case "number":
      distance = km2deg(options.dist);
      break;
    case "string":
      distance = options.dist;
      break;
    default:
      distance = 0;
  }
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(featurecollection(x));
  let buffs = [];
  data.features.forEach((d) => {
    const x =
      typeof distance == "number" ? distance : km2deg(d.properties[distance]);
    let buff = new jsts.io.GeoJSONWriter().write(d.geometry.buffer(x));
    if (buff.coordinates[0].length !== 0) {
      buffs.push({
        type: "Feature",
        properties: d.properties,
        geometry: buff,
      });
    }
  });

  buffs = { type: "FeatureCollection", features: buffs };

  if (options.merge) {
    buffs = union(buffs);
  }
  if (options.clip) {
    buffs = clip(buffs);
  }

  return buffs;
}
