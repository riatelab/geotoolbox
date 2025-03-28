import { type } from "./utils/type.js";
import { dissolve } from "./dissolve.js";
import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });

/**
 * @function aggregate
 * @summary Aggregate geometries (based on topojson). The `aggregate()` function allows to merge all geometries of a geoJSON based on their topology. The `id` parameter allows to aggregate based on a specific field.
 * @description Based on `topojson.merge`.
 * @param {object} options - Optional parameters
 * @param {string} [id = null] - The id of the features to aggregate
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.aggregate(*a geojson*)
 */

export function aggregate(data, { id = null, mutate = false } = {}) {
  // deep copy ?

  let geojson;
  if (!mutate) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let dim = type(geojson).dimension;
  if (id != null && id != undefined) {
    let arr = Array.from(
      new Set(geojson.features.map((d) => d.properties[id]))
    );
    let features = [];
    arr.forEach((myid) => {
      let geo = {
        type: "FeatureCollection",
        features: geojson.features.filter((d) => d.properties[id] == myid),
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

    return {
      type: "FeatureCollection",
      features: features,
    };
  } else {
    let geom;
    if (dim == 3) {
      let topo = topojson.topology({ foo: geojson });
      geom = topojson.merge(topo, topo.objects.foo.geometries);
    }

    if (dim == 2) {
      geom = {
        type: "MultiLineString",
        coordinates: dissolve(geojson).features.map(
          (d) => d.geometry.coordinates
        ),
      };
    }

    if (dim == 1) {
      geom = {
        type: "MultiPoint",
        coordinates: dissolve(geojson).features.map(
          (d) => d.geometry.coordinates
        ),
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
