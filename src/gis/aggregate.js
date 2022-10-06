import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });

export function aggregate(x, options = {}) {
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
      let topo = topojson.topology({ foo: geo });
      features.push({
        type: "Feature",
        properties: { id: myid },
        geometry: topojson.merge(topo, topo.objects.foo.geometries),
      });
    });

    return {
      type: "FeatureCollection",
      features: features,
    };
  } else {
  }

  let topo = topojson.topology({ foo: x });
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: topojson.merge(topo, topo.objects.foo.geometries),
      },
    ],
  };
}
