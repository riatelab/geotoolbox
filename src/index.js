import { getGeos } from "./helpers/geosmanager.js";
import { buffer as bufferRaw } from "./buffer.js";
import { clipbyrect as clipbyrectRaw } from "./clipbyrect.js";

// Load geos to avoid multiple load
const geosReady = getGeos();

export async function buffer(...args) {
  const geos = await geosReady;
  return bufferRaw(geos, ...args);
}

export async function clipbyrect(...args) {
  const geos = await geosReady;
  return clipbyrectRaw(geos, ...args);
}

// // Exportation dynamique après l'initialisation de GEOS
// export function getInitializedFunctions() {
//   if (!initialized) {
//     throw new Error("GEOS n'est pas encore prêt.");
//   }
//   return functions; // Retourne les fonctions une fois GEOS prêt
// }

// initialize().catch((err) => {
//   console.error("Erreur lors de l'initialisation :", err);
// });

//export { simplify } from "./simplify.js";
// export { info } from "./info.js";
// export { togeojson } from "./togeojson.js";
// export { isvalid } from "./isvalid.js";
// export { makevalid } from "./makevalid.js";
export { stitch } from "./stitch.js";
// export { roundcoordinates } from "./roundcoordinates.js";
// export { rewind } from "./rewind.js";
// export { rewind2 } from "./rewind2.js";
// export { removeemptygeom } from "./removeemptygeom.js";
// export { resolveemptygeom } from "./resolveemptygeom.js";
// export { densify } from "./densify.js";
// export { dissolve } from "./dissolve.js";
// export { nodes } from "./nodes.js";
// export { tissot } from "./tissot.js";
// export { geolines } from "./geolines.js";
// export { bbox } from "./bbox.js";
// export { aggregate } from "./aggregate.js";
// export { op } from "./operators.js";
// export { autotype } from "./autotype.js";
// export { head } from "./head.js";
// export { tail } from "./tail.js";
// export { derive } from "./derive.js";
// export { filter } from "./filter.js";
// export { replace } from "./replace.js";
// export { columns } from "./columns.js";
// export { sort } from "./sort.js";
// export { combine } from "./combine.js";
// export { centroid } from "./centroid.js";
// export { border } from "./border.js";
// export { union } from "./union.js";
// export { copy } from "./copy.js";
// export { groupby } from "./groupby.js";
// export { dedupe } from "./dedupe.js";
// export { table } from "./table.js";
// export { join } from "./join.js";
// export { htmltable } from "./htmltable.js";
// export { concavehull } from "./concavehull.js";
// export { envelope } from "./envelope.js";
// export { buffer } from "./buffer.js";
// export { clipbyrect } from "./clipbyrect.js";

// //export { largestemptycircle } from "./largestemptycircle.js";

//export { area } from "./geomfunctions.js";

// -----------------------------------
// deprecated
// export { coords2geo } from "./deprecated/coords2geo.js";
// import { add } from "./deprecated/add.js";
// import { select } from "./deprecated/select.js";
// import { keep } from "./deprecated/keep.js";
// import { remove } from "./deprecated/remove.js";
// import { table } from "./deprecated/table.js";
// import { subset } from "./deprecated/subset.js";
// import { head } from "./deprecated/head.js";
// import { tail } from "./deprecated/tail.js";
// export let properties = {
//   add,
//   select,
//   keep,
//   remove,
//   table,
//   subset,
//   head,
//   tail,
// };
