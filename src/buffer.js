import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { geosloader } from "./helpers/geos.js";
import { check } from "./helpers/check.js";
import { expressiontovaluesinageojson } from "./helpers/expressiontovaluesinageojson.js";
import { geoAzimuthalEquidistant, geoCentroid } from "d3-geo";
const d3 = Object.assign({}, { geoAzimuthalEquidistant, geoCentroid });

/**
 * @function buffer
 * @summary Create a buffer
 * @description Based on `geos.GEOSBuffer()`.
 * @async
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {number|string|function} [options.dist = 0] - The distance to expand the geometry (or contract if the value is negative). If the geometry is unprojected, then the unit is in kilometers. If the geometry is projected, it's in map units. You can use a numer, or a function like `d => d.properties.pop/100000` or a string like `"pop/100000"`
 * @param {booleann} [options.each = false] - Compute a buffur for each features
 * @param {boolean} [options.isProjected = false] - Use false (default) if you are using geometries that are not projected in latitude-longitude. Use true if your base map is already projected.
 * @param {number} [options.quadsegs = 8] - The number of segments per quadrant to generate. More segments provides a more "precise" buffer at the expense of size.
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * // A global buffer
 * await geotoolbox.buffer(*a geojson*, {dist: 50})
 * // A buffer by feature
 * await Promise.all(*a geojson*.features.map((d) => geo.buffer(d, { dist: 50 })));
 * // A buffer by feature based on a field
 * await Promise.all(*a geojson*.features.map((d) => geo.buffer(d, { dist: d.properties["pop"] / 1000000 })))
 */

export async function buffer(
  data,
  { isProjected = false, quadsegs = 8, dist = 0, each = false } = {}
) {
  if (typeof dist == "number" && each == false) {
    return singlebuffer(data, { quadsegs, isProjected, dist });
  } else {
    return multiplebuffer(data, { quadsegs, isProjected, dist });
  }
}

async function multiplebuffer(data, { dist }) {
  const handle = check(data);
  let x = handle.import(data);
  let dists = expressiontovaluesinageojson(x, dist);

  let result = await Promise.all(
    x.features.map(async (d, i) => {
      console.log(d);
      return await buffer(d, { dist: dists[i] });
    })
  );

  return handle.export({
    type: "FeatureCollection",
    name: "buffer",
    features: result,
  });
}

async function singlebuffer(
  data,
  { quadsegs = 8, isProjected = false, dist = 0 } = {}
) {
  const geos = await geosloader();
  const handle = check(data);
  let x = handle.import(data);

  //manage proj
  let proj;
  if (!isProjected) {
    dist = dist * 1000;
    proj = defineProjection(x);
    x = toAzimuthalEquidistant(x, proj);
  }

  // Buffer with geos
  const geosgeom = geojsonToGeosGeom(x, geos);
  const buffer = geos.GEOSBuffer(geosgeom, dist, quadsegs);
  let result = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: x.features.length == 1 ? x.features[0].properties : {},
        geometry: geosGeomToGeojson(buffer, geos),
      },
    ],
  };
  geos.GEOSFree(geosgeom);
  geos.GEOSFree(buffer);

  // Final object
  if (!isProjected) {
    result = toWGS84(result, proj);
  }
  result.name = "buffer";
  return handle.export(result);
}

const earthRadius = 6371008.8;

function defineProjection(geojson) {
  var coords = d3.geoCentroid(geojson);
  var rotation = [-coords[0], -coords[1]];
  return d3.geoAzimuthalEquidistant().rotate(rotation).scale(earthRadius);
}

function projectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj(coords);
  return coords.map(function (coord) {
    return projectCoords(coord, proj);
  });
}

function unprojectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj.invert(coords);
  return coords.map(function (coord) {
    return unprojectCoords(coord, proj);
  });
}

function toAzimuthalEquidistant(x, proj) {
  x.features.forEach(
    (d) =>
      (d.geometry.coordinates = projectCoords(d.geometry.coordinates, proj))
  );
  return x;
}

function toWGS84(x, proj) {
  x.features.forEach(
    (d) =>
      (d.geometry.coordinates = unprojectCoords(d.geometry.coordinates, proj))
  );

  return x;
}
