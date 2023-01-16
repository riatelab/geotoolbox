import { union } from "./union.js";
import { buffer } from "./buffer.js";
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter";
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp";

const jsts = {
  OverlayOp,
  GeoJSONReader,
  GeoJSONWriter,
};

import { featurecollection } from "../utils/featurecollection.js";

/**
 * Clip a FeatureCollection (or a set of Features or Geometries) with another FeatureCollection
 * (or with another set of Features or Geometries).
 *
 * @param {object|array} x - The GeoJSON FeatureCollection / array of Features / array of Geometries
 * @param {object} options - Optional parameters
 * @param {object} options.clip - The clipping GeoJSON FeatureCollection / array of Features / array of Geometries
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}} - The resulting GeoJSON FeatureCollection
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/clip?collection=@neocartocnrs/geotoolbox Observable Notebook}
 */
export function clip(x, options = {}) {
  let reader = new jsts.GeoJSONReader();
  let writer = new jsts.GeoJSONWriter();

  let data = reader.read(featurecollection(x));
  let bufferdist = options.buffer ? options.buffer : 0.1;
  let reverse = options.reverse ? true : false;
  let myclip = null;
  if (options.clip != null && options.clip != undefined) {
    myclip = featurecollection(options.clip);
  } else {
    let delta = 0.00001;
    myclip = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-180 + delta, 90 - delta],
                [180 - delta, 90 - delta],
                [180 - delta, -90 + delta],
                [-180 + delta, -90 + delta],
                [-180 + delta, 90 - delta],
              ],
            ],
          },
        },
      ],
    };
  }
  // clip union

  let geomclip = buffer(union(myclip), {
    dist: reverse ? -bufferdist : bufferdist,
  });

  // return geomclip;
  geomclip = reader.read(geomclip).features[0].geometry;

  // Intersection / difference
  let result = [];

  data.features.forEach((d) => {
    // let geom = d.geometry;

    let geom = reverse
      ? jsts.OverlayOp.difference(d.geometry, geomclip)
      : jsts.OverlayOp.intersection(d.geometry, geomclip);

    // fix point intersection
    if (geom.hasOwnProperty("_coordinates")) {
      if (geom._coordinates._coordinates.length == 0) {
        geom = { type: "Point", coordinates: [] };
      } else {
        geom = writer.write(geom);
      }
    } else {
      geom = writer.write(geom);
    }

    // build features
    if (geom.coordinates.flat().length !== 0) {
      result.push({
        type: "Feature",
        properties: d.properties,
        geometry: geom,
      });
    }
  });

  return {
    type: "FeatureCollection",
    features: result,
  };
}
