import { topology } from "topojson-server";
import { feature } from "topojson-client";
import { featurecollection } from "../utils/featurecollection.js";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantile, simple, feature }
);
import { union } from "./union.js";

export function simplify(geojson, options = {}) {
  let k = options.k ? options.k : 0.5;
  // union or not
  let merge = options.merge === true ? true : false;
  let geo;
  if (merge) {
    geo = union(geojson);
  } else {
    geo = featurecollection(geojson);
  }
  // simplification
  let topo = topojson.topology({ foo: geo });
  let simpl = topojson.presimplify(topo);
  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  geo.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return geo;
}
