/**
 * Rewind a GeoJSON FeatureCollection. A homemade approach that tries to work in most cases. The rewindPole parameter allows forcing the rewind of polar polygons.
 * @param {GeoJSON} data - The input GeoJSON FeatureCollection
 * @param {Object} options
 * @param {boolean} [options.mutate=false] - If false, a copy of the GeoJSON is returned; the original is not modified
 * @param {boolean} [options.rewindPole=false] - If true, forces rewind of polar polygons (Antarctic/Arctic)
 */
export function smartrewind(data, options = {}) {
  const mutate = options.mutate === true;
  const rewindPole = options.rewindPole === true;

  // Work on a copy if mutate is false
  const geo = mutate ? data : structuredClone(data);

  for (const feature of geo.features) {
    let geom = feature.geometry;
    if (!geom) continue;

    // Clean up geometry (remove duplicate points, invalid rings)
    geom = cleanGeom(geom);
    if (!geom) {
      feature.geometry = null;
      continue;
    }

    // ---------------------
    // Detect polar polygons
    // ---------------------
    let isPolar = false;
    let minLat = Infinity;
    let maxLat = -Infinity;

    const coords =
      geom.type === "Polygon"
        ? geom.coordinates.flat()
        : geom.type === "MultiPolygon"
          ? geom.coordinates.flat(2)
          : [];

    for (const [, lat] of coords) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    if (minLat <= -89.9) isPolar = "south";
    else if (maxLat >= 89.9) isPolar = "north";

    // ---------------------
    // Rewind polar polygons if requested
    // ---------------------
    if (isPolar && rewindPole) {
      if (geom.type === "Polygon") geom.coordinates[0].reverse();
      else if (geom.type === "MultiPolygon")
        geom.coordinates.forEach((poly) => poly[0].reverse());

      feature.geometry = geom;
      continue; // skip normal rewind
    }

    // ---------------------
    // Rewind regular polygons
    // ---------------------
    if (geom.type === "Polygon")
      geom.coordinates = fixPolySpherical(geom.coordinates);
    else if (geom.type === "MultiPolygon")
      geom.coordinates = geom.coordinates.map(fixPolySpherical);

    feature.geometry =
      geom.coordinates && geom.coordinates.length ? geom : null;
  }

  return geo;
}

// ---------------------
// Helper functions
// ---------------------

// Clean rings: remove duplicate points, close rings, remove too-short rings
function cleanGeom(geom) {
  function cleanRing(ring) {
    if (!ring || ring.length < 2) return null;
    const cleaned = [ring[0]];
    for (let i = 1; i < ring.length; i++) {
      const [x, y] = ring[i];
      const [x0, y0] = cleaned[cleaned.length - 1];
      if (x !== x0 || y !== y0) cleaned.push(ring[i]);
    }
    const f = cleaned[0],
      l = cleaned[cleaned.length - 1];
    if (f[0] !== l[0] || f[1] !== l[1]) cleaned.push([...f]);
    if (cleaned.length < 4) return null;
    return cleaned;
  }

  if (geom.type === "Polygon") {
    const rings = geom.coordinates.map(cleanRing).filter(Boolean);
    return rings.length ? { ...geom, coordinates: rings } : null;
  }
  if (geom.type === "MultiPolygon") {
    const polys = geom.coordinates
      .map((poly) => poly.map(cleanRing).filter(Boolean))
      .filter((p) => p.length);
    return polys.length ? { ...geom, coordinates: polys } : null;
  }
  return geom;
}

// Fix polygon orientation using spherical method
function fixPolySpherical(rings) {
  const outer = rings[0];
  const inners = rings.slice(1);
  rewindRing(outer, true); // outer ring clockwise
  inners.forEach((r) => rewindRing(r, false)); // inner rings counter-clockwise
  return [outer, ...inners];
}

// Rewind a ring based on desired direction
function rewindRing(ring, dir) {
  let tArea = 0,
    err = 0;
  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    const k = (ring[i][0] - ring[j][0]) * (ring[j][1] + ring[i][1]);
    const m = tArea + k;
    err += Math.abs(tArea) >= Math.abs(k) ? tArea - m + k : k - m + tArea;
    tArea = m;
  }
  if (tArea + err >= 0 !== !!dir) ring.reverse();
}
