import { featurecollection } from "../utils/featurecollection.js";
import { type } from "../utils/type.js";
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter";
//import DistanceOp from "jsts.operation.distance.DistanceOp";

const jsts = {
  //DistanceOp,
  GeoJSONReader,
  GeoJSONWriter,
};

export function distance(x, options = {}) {
  //   let reader = new jsts.GeoJSONReader();
  //   let writer = new jsts.GeoJSONWriter();
  //   let data = reader.read(featurecollection(x));
  //   let result = [];
  //   data.forEach((d) => {
  //     data.forEach((e) => {
  //       result.push({ distance: computedistance(d.geometry, e.geometry) });
  //     });
  //   });
  // }
  // function computedistance(a, b) {
  //   const DistanceOp = new jsts.operation.distance.DistanceOp(a, b);
  //   return DistanceOp.distance();
}
