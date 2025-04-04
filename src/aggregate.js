import { check } from "./helpers/check.js";
import { type } from "./helpers/type.js";
import { dissolve } from "./dissolve.js";
import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });

/**
 * @function aggregate
 * @summary Aggregate geometries (based on topojson). The `aggregate()` function allows to merge all geometries of a geoJSON based on their topology. The `id` parameter allows to aggregate based on a specific field.
 * @description Based on `topojson.merge`.
 * @param {object|array} data - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry.
 * @param {object} options - Optional parameters
 * @param {string} [options.id = null] - The id of the features to aggregate
 * @returns {object|array} - A GeoJSON FeatureCollection, an array of features, an array of geometries, a single feature or a single geometry (it depends on what you've set as `data`).
 * @example
 * geotoolbox.aggregate(*a geojson*)
 */

export function aggregate(data, { id = null } = {}) {
  const handle = check(data);
  let x = handle.import(data);
  let result;

  let dim = type(x).dimension;
  if (id != null && id != undefined) {
    let arr = Array.from(new Set(x.features.map((d) => d.properties[id])));
    let features = [];
    arr.forEach((myid) => {
      let geo = {
        type: "FeatureCollection",
        features: x.features.filter((d) => d.properties[id] == myid),
      };
      //return geo;

      let geom;
      if (dim == 3) {
        let topo = topojson.topology({ foo: geo });
        geom = topojson.merge(topo, topo.objects.foo.geometries);
      }

      if (dim == 2) {
        geom = {
          type: "MultiLineString",
          coordinates: dissolve(geo).features.map(
            (d) => d.geometry.coordinates
          ),
        };
      }

      if (dim == 1) {
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

    result = {
      type: "FeatureCollection",
      features: features,
    };
  } else {
    let geom;
    if (dim == 3) {
      let topo = topojson.topology({ foo: x });
      geom = topojson.merge(topo, topo.objects.foo.geometries);
    }

    if (dim == 2) {
      geom = {
        type: "MultiLineString",
        coordinates: dissolve(x).features.map((d) => d.geometry.coordinates),
      };
    }

    if (dim == 1) {
      geom = {
        type: "MultiPoint",
        coordinates: dissolve(x).features.map((d) => d.geometry.coordinates),
      };
    }

    result = {
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
  result.name = "aggregate";
  return handle.export(result);
}
