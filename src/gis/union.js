import { type } from "../utils/type.js";
import { aggregate } from "./aggregate.js";
import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });
import { featurecollection } from "../utils/featurecollection.js";
import UnaryUnionOp from "jsts/org/locationtech/jts/operation/union/UnaryUnionOp";
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter";

const jsts = {
  UnaryUnionOp,
  GeoJSONReader,
  GeoJSONWriter,
};

export function union(x, options = {}) {
  x = featurecollection(x);
  let geomtype = type(x);

  if (geomtype == "line" || geomtype == "point") {
    return aggregate(x, options);
  } else {
    let reader = new jsts.GeoJSONReader();
    let writer = new jsts.GeoJSONWriter();
    if (options.id != null && options.id != undefined) {
      // Union by id
      let ids = Array.from(
        new Set(x.features.map((d) => d.properties[options.id]))
      );

      let result = [];
      ids.forEach((d) => {
        let subx = featurecollection(
          x.features.filter((e) => e.properties[options.id] == d)
        );

        let topo = topojson.topology({ foo: subx });
        let geom = topojson.merge(topo, topo.objects.foo.geometries);
        result.push({
          type: "Feature",
          properties: { id: d },
          geometry: writer.write(
            jsts.UnaryUnionOp.union(
              reader.read(featurecollection(geom)).features[0].geometry
            )
          ),
        });
      });

      return {
        type: "FeatureCollection",
        features: result,
      };
    } else {
      // Union all
      let topo = topojson.topology({ foo: x });
      let geom = topojson.merge(topo, topo.objects.foo.geometries);
      return {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry:
              geomtype == "poly"
                ? writer.write(
                    jsts.UnaryUnionOp.union(
                      reader.read(featurecollection(geom)).features[0].geometry
                    )
                  )
                : geom,
          },
        ],
      };
    }
  }
}
