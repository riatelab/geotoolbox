//import * as jsts from "jsts/dist/jsts";

import { io } from "jsts/dist/jsts";
const jsts = Object.assign({}, { io });
import { featurecollection } from "../helpers/featurecollection.js";

// Ajouter id comme option comme dans aggregate

export function union(x, options = {}) {
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(featurecollection(x));

  if (options.id != null && options.id != undefined) {
    // Union by id
    let ids = Array.from(
      new Set(data.features.map((d) => d.properties[options.id]))
    );

    let result = [];
    ids.forEach((d) => {
      let features = data.features.filter((e) => e.properties[options.id] == d);
      let geom = features[0].geometry;
      for (let i = 1; i < features.length; i++) {
        geom = geom.union(features[i].geometry);
      }

      result.push({
        type: "Feature",
        properties: { id: d },
        geometry: new jsts.io.GeoJSONWriter().write(geom),
      });
    });

    return {
      type: "FeatureCollection",
      features: result,
    };
  } else {
    // Union all
    let geom = data.features[0].geometry;
    for (let i = 1; i < data.features.length; i++) {
      geom = geom.union(data.features[i].geometry);
    }

    const result = new jsts.io.GeoJSONWriter().write(geom);

    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: result }],
    };
  }
}
