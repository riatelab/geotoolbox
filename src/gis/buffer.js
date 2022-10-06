import * as jsts from "jsts/dist/jsts";
import { km2deg } from "../helpers/km2deg.js";
import { union } from "./union.js";

// TODO : clip world extent

export function buffer(geojson, options = {}) {
  let distance = 0;
  switch (typeof options.dist) {
    case "number":
      distance = km2deg(options.dist);
      break;
    case "string":
      distance = options.dist;
      break;
    default:
      distance = km2deg(1000);
  }
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(geojson);
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

  if (options.merge) {
    return union({ type: "FeatureCollection", features: buffs });
  } else {
    return { type: "FeatureCollection", features: buffs };
  }
}
