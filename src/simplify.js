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
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.k = undefined] - quantile of the simplification (from 0 to 1). If not defened, the generalization level is calculated automatically to ensure smooth map display.
 * @param {number} [options.quantize = undefined] - A smaller quantizeAmount produces a smaller file. Typical values are between 1e4 and 1e6, although it depends on the resolution you want in the output file.
 * @param {number} [options.arcs = 15000] - Instead of the k parameter, you can determine the level of generalization by targeting a specific number of arcs. The result will be an approximation.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.simplify(*a geojson*, {k: 0.1})
 */

export function simplify(
  data,
  { k = undefined, quantize = undefined, arcs = 15000, mutate = false } = {}
) {
  // deep copy ?
  let geojson;
  if (!mutate) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let topo = topojson.topology({ foo: geojson });
  let simpl = topojson.presimplify(topo);

  if (k == undefined) {
    k = arcs / simpl.arcs.flat().length;
    k = k > 1 ? 1 : k;
  }

  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  if (quantize) {
    simpl = topojson.quantiz(simpl, quantize);
  }

  geojson.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return geojson;
}
