import { topology } from "topojson-server";
import { feature } from "topojson-client";
import { presimplify, quantile, simplify } from "topojson-simplify";
const topojson = Object.assign(
  {},
  { topology, presimplify, quantile, simplify, feature }
);
import { union } from "./union.js";

export function simple(geojson, options = {}) {
  let k = options.k ? options.k : 0.5;
  // union or not
  let merge = options.merge === true ? true : false;
  let geo;
  if (merge) {
    geo = union(geojson);
  } else {
    geo = JSON.parse(JSON.stringify(geojson));
  }
  // simplification
  let topo = topojson.topology({ foo: geo });
  let simpl = topojson.presimplify(topo);
  simpl = topojson.simplify(simpl, topojson.quantile(simpl, k));
  geo.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return geo;
}
