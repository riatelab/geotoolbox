// information
export { htmltable } from "./htmltable.js";
export { info } from "./info.js";
export { isvalid } from "./isvalid.js";

// Data handling
export { copy } from "./copy.js";
export { groupby } from "./groupby.js";
export { dedupe } from "./dedupe.js";
export { table } from "./table.js";
export { join } from "./join.js";
export { autotype } from "./autotype.js";
export { head } from "./head.js";
export { tail } from "./tail.js";
export { derive } from "./derive.js";
export { filter } from "./filter.js";
export { replace } from "./replace.js";
export { columns } from "./columns.js";
export { sort } from "./sort.js";
export { combine } from "./combine.js";

// GIS

export { simplify } from "./simplify.js";
export { togeojson } from "./togeojson.js";
export { stitch } from "./stitch.js";
export { removeemptygeom } from "./removeemptygeom.js";
export { resolveemptygeom } from "./resolveemptygeom.js";
export { nodes } from "./nodes.js";
export { tissot } from "./tissot.js";
export { geolines } from "./geolines.js";
export { bbox } from "./bbox.js";
export { border } from "./border.js";
export { roundcoordinates } from "./roundcoordinates.js";
export { centroid } from "./centroid.js";
export { aggregate } from "./aggregate.js";
export { rewind } from "./rewind.js";
export { rewind2 } from "./rewind2.js";
export { dissolve } from "./dissolve.js";

// GEOS (async)

export { buffer } from "./buffer.js";
export { clipbyrect } from "./clipbyrect.js";
export { makevalid } from "./makevalid.js";
export { densify } from "./densify.js"; // ok
export { union } from "./union.js";
export { concavehull } from "./concavehull.js";
export { convexhull } from "./convexhull.js";
export { envelope } from "./envelope.js";
export { op } from "./operators.js";

export { check } from "./helpers/check.js";

//export { largestemptycircle } from "./largestemptycircle.js";

//export { area } from "./geomfunctions.js";

// -----------------------------------
// deprecated
export { coords2geo } from "./deprecated/coords2geo.js";
import { add } from "./deprecated/add.js";
import { select } from "./deprecated/select.js";
import { keep } from "./deprecated/keep.js";
import { remove } from "./deprecated/remove.js";
import { table } from "./deprecated/table.js";
import { subset } from "./deprecated/subset.js";
import { head } from "./deprecated/head.js";
import { tail } from "./deprecated/tail.js";
export let properties = {
  add,
  select,
  keep,
  remove,
  table,
  subset,
  head,
  tail,
};
