import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter.js";
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp.js";
const jsts = Object.assign({}, { GeoJSONReader, GeoJSONWriter, BufferOp });
import { clip } from "./clip.js";
import { km2deg } from "../helpers/km2deg.js";
import { union } from "./union.js";
import { featurecollection } from "../helpers/featurecollection.js";

export function buffer(x, options = {}) {
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

    let buff = new jsts.GeoJSONWriter().write(
      jsts.BufferOp.bufferOp(d.geometry, featdist, step)
    );

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
