import initGeosJs from "../../node_modules/geos-wasm/build/package/geos.esm.js";

// Function designed by Christoph Pahmeyer (https://github.com/chrispahm)
export async function geojsonCoordsToGeosCoordSeq(coords) {
  const geos = await initGeosJs();

  if (!coords || coords.length === 0) {
    return null;
  }
  const N = coords.length;
  const dim = 2; // coords[0].length
  const coordArr = new Float64Array(coords.flat());
  const coordPtr = geos.Module._malloc(N * dim * 8);
  geos.Module.HEAPF64.set(coordArr, coordPtr / 8);
  const seqPtr = geos.GEOSCoordSeq_copyFromBuffer(coordPtr, N, false, false);
  geos.Module._free(coordPtr);
  return seqPtr;
}
