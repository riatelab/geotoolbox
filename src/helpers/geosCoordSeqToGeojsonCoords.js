import initGeosJs from "../../node_modules/geos-wasm/build/package/geos.esm.js";

// Function designed by Christoph Pahmeyer (https://github.com/chrispahm)
export async function geosCoordSeqToGeojsonCoords(seqPtr) {
  const geos = await initGeosJs();

  if (!seqPtr) {
    return null;
  }
  const sizePtr = geos.Module._malloc(4);
  geos.GEOSCoordSeq_getSize(seqPtr, sizePtr);
  const size = geos.Module.getValue(sizePtr, "i32");
  geos.Module._free(sizePtr);
  if (size === 0) {
    return [];
  }
  const coords = [];
  const coordsPtr = geos.Module._malloc(size * 2 * 8);
  geos.GEOSCoordSeq_copyToBuffer(seqPtr, coordsPtr, false, false);
  const view = new Float64Array(
    geos.Module.HEAPF64.buffer,
    coordsPtr,
    size * 2
  );
  for (let i = 0; i < size * 2; i = i + 2) {
    coords.push([view[i], view[i + 1]]);
  }
  geos.Module._free(coordsPtr);
  return coords;
}
