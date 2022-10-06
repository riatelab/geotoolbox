import * as jsts from "jsts/dist/jsts";

// Ajouter id comme option comme dans aggregate

export function union(x) {
  let reader = new jsts.io.GeoJSONReader();
  let data = reader.read(x);

  let geom = data.features[0].geometry;

  for (let i = 1; i < data.features.length; i++) {
    geom = geom.union(data.features[i].geometry);
  }

  data.features.map((d) => d.geometry);

  const result = new jsts.io.GeoJSONWriter().write(geom);

  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", properties: {}, geometry: result }],
  };
}
