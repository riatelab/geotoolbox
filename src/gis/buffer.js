import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp";
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter";
const jsts = {
  BufferOp,
  GeoJSONReader,
  GeoJSONWriter,
};
import { union } from "./union.js";
import { clip } from "./clip.js";
import { km2deg } from "../utils/km2deg.js";
import { featurecollection } from "../utils/featurecollection.js";

export function buffer(x, options = {}) {
  // Parameters
  let step = options.step ? options.step : 8;
  let wgs84 = options.wgs84 === false ? false : true;
  let distance = 0;
  switch (typeof options.dist) {
    case "number":
      distance = wgs84 ? km2deg(options.dist) : options.dist;
      break;
    case "string":
      distance = options.dist;
      break;
    default:
      distance = 0;
  }

  let reader = new jsts.GeoJSONReader();
  let writer = new jsts.GeoJSONWriter();

  let data = reader.read(featurecollection(x));
  let buffs = [];
  data.features.forEach((d) => {
    let featdist = 0;
    if (typeof distance == "number") {
      featdist = distance;
    } else {
      featdist = wgs84
        ? km2deg(d.properties[distance])
        : d.properties[distance];
    }

    let buff = jsts.BufferOp.bufferOp(d.geometry, featdist, step);

    buff = writer.write(buff);

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
