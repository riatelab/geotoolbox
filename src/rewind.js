import { geoContains, geoArea, geoStream, geoTransform } from "d3-geo";

/**
 * @function rewind
 * @summary Rewind a geoJSON ([fil recipe](https://observablehq.com/@fil/rewind)). The function allows to rewind the winding order of a GeoJSON object. The winding order of a polygon is the order in which the vertices are visited by the path that defines the polygon. The winding order of a polygon is significant because it determines the interior of the polygon. The winding order of a polygon is typically either clockwise or counterclockwise.
 * @param {object} options - Optional parameters
 * @param {number} [options.simple = true] - Rewind simple polygons larger than a hemisphere
 * @example
 * geotoolbox.rewind(*a geojson*)
 */
export function rewind(data, { simple = true } = {}) {
  return data?.stream
    ? geoRewindProjection(data, simple)
    : data?.type
    ? geoRewindFeature(data, simple)
    : Array.isArray(data)
    ? Array.from(data, (d) => rewind(d, simple))
    : data;
}

const geoRewindFeature = (feature, simple) =>
  geoProjectSimple(feature, geoRewindStream(simple));

function geoRewindStream(simple = true) {
  let ring, polygon;
  return geoTransform({
    polygonStart() {
      this.stream.polygonStart();
      polygon = [];
    },
    lineStart() {
      if (polygon) polygon.push((ring = []));
      else this.stream.lineStart();
    },
    lineEnd() {
      if (!polygon) this.stream.lineEnd();
    },
    point(x, y) {
      if (polygon) ring.push([x, y]);
      else this.stream.point(x, y);
    },
    polygonEnd() {
      for (let [i, ring] of polygon.entries()) {
        ring.push(ring[0].slice());
        if (
          i
            ? // a hole must contain the first point of the polygon
              !geoContains(
                { type: "Polygon", coordinates: [ring] },
                polygon[0][0]
              )
            : polygon[1]
            ? // the outer ring must contain the first point of its first hole (if any)
              !geoContains(
                { type: "Polygon", coordinates: [ring] },
                polygon[1][0]
              )
            : // a single ring polygon must be smaller than a hemisphere (optional)
              simple &&
              geoArea({ type: "Polygon", coordinates: [ring] }) > 2 * Math.PI
        ) {
          ring.reverse();
        }

        this.stream.lineStart();
        ring.pop();
        for (const [x, y] of ring) this.stream.point(x, y);
        this.stream.lineEnd();
      }
      this.stream.polygonEnd();
      polygon = null;
    },
  });
}

const geoProjectSimple = function (object, projection) {
  const stream = projection.stream;
  let project;
  if (!stream) throw new Error("invalid projection");
  switch (object && object.type) {
    case "Feature":
      project = projectFeature;
      break;
    case "FeatureCollection":
      project = projectFeatureCollection;
      break;
    default:
      project = projectGeometry;
      break;
  }
  return project(object, stream);
};

function projectFeatureCollection(o, stream) {
  return { ...o, features: o.features.map((f) => projectFeature(f, stream)) };
}

function projectFeature(o, stream) {
  return { ...o, geometry: projectGeometry(o.geometry, stream) };
}

function projectGeometryCollection(o, stream) {
  return {
    ...o,
    geometries: o.geometries.map((o) => projectGeometry(o, stream)),
  };
}

function projectGeometry(o, stream) {
  return !o
    ? null
    : o.type === "GeometryCollection"
    ? projectGeometryCollection(o, stream)
    : o.type === "Polygon" || o.type === "MultiPolygon"
    ? projectPolygons(o, stream)
    : o;
}

function projectPolygons(o, stream) {
  let coordinates = [];
  let polygon, line;
  geoStream(
    o,
    stream({
      polygonStart() {
        coordinates.push((polygon = []));
      },
      polygonEnd() {},
      lineStart() {
        polygon.push((line = []));
      },
      lineEnd() {
        line.push(line[0].slice());
      },
      point(x, y) {
        line.push([x, y]);
      },
    })
  );
  if (o.type === "Polygon") coordinates = coordinates[0];
  return { ...o, coordinates, rewind: true };
}
