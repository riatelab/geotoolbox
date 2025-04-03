import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "../helpers/geojsonToGeosGeom";
import { geosGeomToGeojson } from "../helpers/geosGeomToGeojson";
import { meter2deg } from "../helpers/meter2deg.js";
import { featurecollection } from "../featurecollection.js";
import { geoAzimuthalEquidistant } from "d3-geo";

/**
 * Build a buffer
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/buffer?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} data - The targeted FeatureCollection / Features / Geometries
 * @param {object} options - Optional parameters
 * @param {number|string} options.dist - The distance of the buffer in km or the name of the field containing the distance values
 * @param {boolean} [options.merge=false] - Merge all the output buffers into a single Geometry
 * @param {boolean} [options.quadsegs] - Quadsegs
 * @param {boolean} [options.wgs84=true] - Whether the input data is in WGS84 or not
 *
 */
export async function buffer2(x, options = {}) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();

  // Parameters

  let quadsegs = options.quadsegs ? options.quadsegs : 8;
  let wgs84 = options.wgs84 === false ? false : true;
  let distance = 0;
  switch (typeof options.dist) {
    case "number":
      distance = options.dist * 1000;
      break;
    case "string":
      distance = options.dist;
      break;
  }

  x = wgs84
    ? toAzimuthalEquidistant(featurecollection(x))
    : featurecollection(x);

  // keep properties
  let prop = { ...x };
  delete prop.features;

  // One buffer
  if (options.merge) {
    const geosGeom = geojsonToGeosGeom(x, geos);
    const newGeom = geos.GEOSBuffer(geosGeom, distance, quadsegs);
    return Object.assign(prop, {
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: geosGeomToGeojson(newGeom, geos),
        },
      ],
    });
  }

  // Several buffers
  else {
    let buff = [];
    x.features.forEach((d) => {
      let featdist =
        typeof distance == "number"
          ? distance
          : wgs84
          ? km2deg(d.properties[distance])
          : d.properties[distance];
      const geosGeom = geojsonToGeosGeom(d, geos);
      const newGeom = geos.GEOSBuffer(geosGeom, featdist, quadsegs);

      buff.push({
        type: "Feature",
        properties: d.properties,
        geometry: geosGeomToGeojson(newGeom, geos),
      });
    });
    buff = buff.filter((d) => d.geometry.coordinates != 0);
    const result = Object.assign(prop, { features: buff });

    return wgs84 ? toWGS84(result) : result;
  }
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
    (d) => (d.geometry.coordinates = projectCoords(d.geometry.coordinates))
  );
  return x;
}

function toWGS84(x, proj) {
  x.features.forEach(
    (d) => (d.geometry.coordinates = unprojectCoords(d.geometry.coordinates,))
  );

  return x;
}
