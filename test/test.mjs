import _ from "lodash";
import jsonDiff from "json-diff";
import test from "node:test";
import geo from "../dist/index.min.js";
import { readFileSync, writeFileSync } from "fs";
const buff1000km = JSON.parse(readFileSync("test/features/buff1000km.json"));

test("geos-union", async (t) => {
  const result = await geo.geosunion(buff1000km);
  const results_jsts = await geo.union(buff1000km);
  if (_.isEqual(result, results_jsts)) {
    t.pass();
  } else {
    //console.log(jsonDiff.diff(result, results_jsts));
  }
});
