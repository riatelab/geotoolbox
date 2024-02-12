import initGeosJs from 'geos-wasm';
import { geojsonToGeosGeom } from '../helpers/geojsonToGeosGeom';
import { geosGeomToGeojson } from '../helpers/geosGeomToGeojson';
import { km2deg } from '../utils/km2deg.js';
import { featurecollection } from '../utils/featurecollection.js';

/**
 * Build a buffer with GEOS-WASM around a FeatureCollection or a set of Features or Geometries.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/buffer?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 * @param {object} options - Optional parameters
 * @param {number|string} options.dist - The distance of the buffer in km or the name of the field containing the distance values
 * @param {boolean} [options.merge=false] - Merge all the output buffers into a single Geometry
 * @param {boolean} [options.quadsegs] - Quadsegs
 * @param {boolean} [options.wgs84=true] - Whether the input data is in WGS84 or not
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}} - The resulting GeoJSON FeatureCollection
 *
 */
export async function buffer(x, options = {}) {
  // TODO: This will create a new GEOS instance with every call
  //       to geosunion. Ideally, we should create a single instance
  //       when the library is loaded and then just pass it around
  const geos = await initGeosJs();
  x = featurecollection(x);
  // Options

  // Parameters
  let quadsegs = options.quadsegs ? options.quadsegs : 8;
  let wgs84 = options.wgs84 === false ? false : true;
  let distance = 0;
  switch (typeof options.dist) {
    case 'number':
      distance = wgs84 ? km2deg(options.dist) : options.dist;
      break;
    case 'string':
      distance = options.dist;
      break;
  }

  let endCapStyle = options.endCapStyle;
  let joinStyle = options.joinStyle;
  let mitreLimit = options.mitreLimit;
  let singleSided = options.singleSided;

  const isBufferWithParams =
    endCapStyle || joinStyle || mitreLimit || singleSided;

  let bufferParamsPtr;
  if (isBufferWithParams) {
    bufferParamsPtr = geos.GEOSBufferParams_create();
    if (endCapStyle) {
      geos.GEOSBufferParams_setEndCapStyle(bufferParamsPtr, endCapStyle);
    }
    if (joinStyle) {
      geos.GEOSBufferParams_setJoinStyle(bufferParamsPtr, joinStyle);
    }
    if (mitreLimit) {
      geos.GEOSBufferParams_setMitreLimit(bufferParamsPtr, mitreLimit);
    }
    if (quadsegs) {
      geos.GEOSBufferParams_setQuadrantSegments(bufferParamsPtr, quadsegs);
    }
    if (singleSided) {
      geos.GEOSBufferParams_setSingleSided(bufferParamsPtr, singleSided);
    }
  }

  // keep properties
  let prop = { ...x };
  delete prop.features;

  // One buffer
  let newGeom;
  if (options.merge) {
    const geosGeom = geojsonToGeosGeom(x, geos);
    if (isBufferWithParams) {
      newGeom = geos.GEOSBufferWithParams(geosGeom, bufferParamsPtr, distance);
    } else {
      newGeom = geos.GEOSBuffer(geosGeom, distance, quadsegs);
    }
    return Object.assign(prop, {
      features: [
        {
          type: 'Feature',
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
        typeof distance == 'number'
          ? distance
          : wgs84
          ? km2deg(d.properties[distance])
          : d.properties[distance];
      const geosGeom = geojsonToGeosGeom(d, geos);

      let newGeom;
      if (isBufferWithParams) {
        newGeom = geos.GEOSBufferWithParams(
          geosGeom,
          bufferParamsPtr,
          distance
        );
      } else {
        newGeom = geos.GEOSBuffer(geosGeom, distance, quadsegs);
      }

      buff.push({
        type: 'Feature',
        properties: d.properties,
        geometry: geosGeomToGeojson(newGeom, geos),
      });
    });
    buff = buff.filter((d) => d.geometry.coordinates != 0);
    return Object.assign(prop, { features: buff });
  }
}
