//import { io.GeoJSONReader as GeoJSONReader, io.GeoJSONWriter as GeoJSONWriter } from "jsts/dist/jsts";
// import { GeoJSONReader, GeoJSONWriter } from "jsts/java/io";
// const jsts = Object.assign({}, { GeoJSONReader, GeoJSONWriter });

import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter.js";
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp.js";
const jsts = Object.assign({}, { GeoJSONReader, GeoJSONWriter, BufferOp });

// Cf dans TURF https://github.com/Turfjs/turf/blob/master/packages/turf-buffer/index.js

// import jsts from "jsts/dist/jsts";

//const jsts = Object.assign({}, { GeoJSONReader, GeoJSONWriter });

//import { clip } from "./clip.js";
import { km2deg } from "../helpers/km2deg.js";
//import { union } from "./union.js";
import { featurecollection } from "../helpers/featurecollection.js";

export function buffer2(x, options = {}) {
  let step = options.step ? options.step : 8;

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

  let reader = new jsts.GeoJSONReader();
  let data = reader.read(featurecollection(x));
  let buffs = [];
  data.features.forEach((d) => {
    let buff = new jsts.GeoJSONWriter().write(
      jsts.BufferOp.bufferOp(d.geometry, distance, step)
    );
    buffs.push({
      type: "Feature",
      properties: d.properties,
      geometry: buff,
    });
  });
  return { type: "FeatureCollection", features: buffs };

  //   let reader = new jsts.GeoJSONReader();
  //   let data = reader.read(featurecollection(x));
  //   let buffs = [];
  //   data.features.forEach((d) => {
  //     const dist =
  //       typeof distance == "number" ? distance : km2deg(d.properties[distance]);

  //     let buff = new jsts.GeoJSONWriter().write(
  //       jsts.BufferOp.bufferOp(d.geometry, 10, 8)
  //     );

  //     console.log(buff);

  //     if (buff.coordinates[0].length !== 0) {
  //       buffs.push({
  //         type: "Feature",
  //         properties: d.properties,
  //         geometry: buff,
  //       });
  //     }
  //   });

  //   buffs = { type: "FeatureCollection", features: buffs };

  //   //   if (options.merge) {
  //   //     buffs = union(buffs);
  //   //   }
  //   //   if (options.clip) {
  //   //     buffs = clip(buffs);
  //   //   }

  //return buffs;
}
