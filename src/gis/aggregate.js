import { type } from "../utils/type.js";
import { dissolve } from "./dissolve.js";
import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });
import { featurecollection } from "../utils/featurecollection.js";

/**
 * Takes a FeatureCollection or a set of Features or Geometries and merge them
 * based on their topology.
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 * @param {object} [options={}] - Optional parameters
 * @param {string} [options.id] - The id of the features to aggregate
 * @returns {{features: [{geometry:{}, type: string, properties: {}}], type: string}} - The new GeoJSON FeatureCollection
 *
 * @see the <code>union</code> function
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/aggregate?collection=@neocartocnrs/geotoolbox Observable Notebook}
 */
export function aggregate(x, options = {}) {
  x = featurecollection(x);
  if (options.id != null && options.id != undefined) {
    let id = options.id;
    let arr = Array.from(new Set(x.features.map((d) => d.properties[id])));
    let features = [];
    arr.forEach((myid) => {
      let geo = {
        type: "FeatureCollection",
        features: x.features.filter((d) => d.properties[id] == myid),
      };
      //return geo;

      let geom;
      if (type(x) == "poly") {
        let topo = topojson.topology({ foo: geo });
        geom = topojson.merge(topo, topo.objects.foo.geometries);
      }

      if (type(x) == "line") {
        geom = {
          type: "MultiLineString",
          coordinates: dissolve(geo).features.map(
            (d) => d.geometry.coordinates
          ),
        };
      }

      if (type(x) == "point") {
        geom = {
          type: "MultiPoint",
          coordinates: dissolve(geo).features.map(
            (d) => d.geometry.coordinates
          ),
        };
      }

      features.push({
        type: "Feature",
        properties: { id: myid },
        geometry: geom,
      });
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } else {
    let geom;
    if (type(x) == "poly") {
      let topo = topojson.topology({ foo: x });
      geom = topojson.merge(topo, topo.objects.foo.geometries);
    }

    if (type(x) == "line") {
      geom = {
        type: "MultiLineString",
        coordinates: dissolve(x).features.map((d) => d.geometry.coordinates),
      };
    }

    if (type(x) == "point") {
      geom = {
        type: "MultiPoint",
        coordinates: dissolve(x).features.map((d) => d.geometry.coordinates),
      };
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: geom,
        },
      ],
    };
  }
}
