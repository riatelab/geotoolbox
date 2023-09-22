// Utils
export { featurecollection } from "./utils/featurecollection.js";
export { rewind } from "./utils/rewind.js";
export { type } from "./utils/type.js";
export { topojson } from "./utils/topojson.js";
export { makevalid } from "./utils/makevalid.js";

// Properties operations

import { add } from "./properties/add.js";
import { select } from "./properties/select.js";
import { keep } from "./properties/keep.js";
import { remove } from "./properties/remove.js";
import { table } from "./properties/table.js";
import { subset } from "./properties/subset.js";
import { head } from "./properties/head.js";
import { tail } from "./properties/tail.js";
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

// Iterators
export { map } from "./iterator/map.js";
export { filter } from "./iterator/filter.js";

// GIS operations
export { aggregate } from "./gis/aggregate.js";
export { centroid } from "./gis/centroid.js";
export { border } from "./gis/border.js";
export { bbox } from "./gis/bbox.js";
export { dissolve } from "./gis/dissolve.js";
export { coords2geo } from "./gis/coords2geo.js";
export { tissot } from "./gis/tissot.js";
export { geolines } from "./gis/geolines.js";
export { buffer } from "./gis/buffer.js";
export { clip } from "./gis/clip.js";
export { nodes } from "./gis/nodes.js";
export { densify } from "./gis/densify.js";
export { union } from "./gis/union.js";
export { op } from "./gis/operators.js";

//export { simplify } from "./gis/simplify.js";
