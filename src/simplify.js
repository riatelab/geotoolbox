import { check } from "./helpers/check.js";
import { topology } from "topojson-server";
import { feature, quantize as quantiz } from "topojson-client";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantiz, quantile, simple, feature }
);

/**
 * @function simplify
 * @export
 * @summary Simplify geometries. The `simplify()` function allows to simplify a geometry using <code>topojson-simplify</code> library. The parameter k difine the  The quantile of the simplification. By default, the generalization level is calculated automatically to ensure smooth map display.
 * @description Based on `topojson.simplify`.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {number} [options.k = undefined] - quantile of the simplification (from 0 to 1). If not defened, the generalization level is calculated automatically to ensure smooth map display.
 * @param {number} [options.quantize = undefined] - A smaller quantizeAmount produces a smaller file. Typical values are between 1e4 and 1e6, although it depends on the resolution you want in the output file.
 * @param {number} [options.arcs = 15000] - Instead of the k parameter, you can determine the level of generalization by targeting a specific number of arcs. The result will be an approximation.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.simplify(*a geojson*, {k: 0.1})
 */

export function simplify(
  data,
  { k = undefined, quantize = undefined, arcs = 15000 } = {}
) {
  const handle = check(data);
  let x = handle.import(data);
  let topo = topojson.topology({ foo: x });
  let simpl = topojson.presimplify(topo);

  if (k == undefined) {
    k = arcs / simpl.arcs.flat().length;
    k = k > 1 ? 1 : k;
  }

  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  if (quantize) {
    simpl = topojson.quantiz(simpl, quantize);
  }

  x.features = topojson.feature(simpl, Object.keys(simpl.objects)[0]).features;
  x.name = "simplify";
  return handle.export(x);
}
