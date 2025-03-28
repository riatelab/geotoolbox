import { topology } from "topojson-server";
import { neighbors, mesh } from "topojson-client";
const topojson = Object.assign({}, { topology, neighbors, mesh });
import * as d3array from "d3-array";
const d3 = Object.assign({}, d3array);

/**
 * @function border
 * @summary Extract boundaries from a GeoJSON FeatureCollection
 * @description Based on `topojson.mesh` and `topojson.neighbors`
 * @param {object} data - A GeoJSON FeatureCollection.
 * @param {object} options - Optional parameters.
 * @param {boolean} [options.id = false] - If you don't provide an id field (default), then the function returns a geoJSON with a single geometry. If you choose an id field, the function returns a geoJSON with multiple geometries and associated codes (two ids for each geometry).
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.border(*a geojson*, {id: "ISO3"})
 */
export function border(data, { id, mutate = false } = {}) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }
  const topo = topojson.topology({ d: x });

  // With ids
  if (typeof id === "string" && id !== "") {
    const ids = [...new Set(x.features.map((d) => d?.properties[id]))].filter(
      (d) => ![null, undefined, ""].includes(d)
    );
    const neighbors = topojson.neighbors(topo.objects["d"].geometries);
    let result = [];
    ids.forEach((e) => {
      let r = neighbors[ids.indexOf(e)].map((i) => ({
        type: "Feature",
        properties: {
          id: e.toString() + "|" + ids[i].toString(),
          i: e,
          j: ids[i],
        },
        geometry: topojson.mesh(
          topo,
          topo.objects["d"],
          (a, b) => (a.properties[id] == e) & (b.properties[id] == ids[i])
        ),
      }));
      result.push(r);
    });

    x.features = result.flat();
  } else {
    x.features = [
      {
        type: "Feature",
        properties: {},
        geometry: topojson.mesh(
          topo,
          Object.entries(topo.objects)[0][1],
          (a, b) => a !== b
        ),
      },
    ];
  }
  return x;
}
