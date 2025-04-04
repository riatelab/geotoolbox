import {
  isFeatureCollection,
  isFeatures,
  isFeature,
  isGeometries,
  isGeometry,
  isarrayofobjects,
} from "./helpers.js";

export function check(data) {
  let type = "";
  let funcimport;
  let funcexport;

  // Case where the input is already a valid GeoJSON (FeatureCollection)
  if (isFeatureCollection(data)) {
    type = "FeatureCollection";
    funcimport = (d) => copy(d); // Return a copy of the object
    funcexport = (d) => d;
  }
  // Case where the input is an array of features
  else if (isFeatures(data)) {
    type = "Features";
    funcimport = (d) => copy({ type: "FeatureCollection", features: d }); // Return a copy of the features array
    funcexport = (d) => d.features;
  }
  // Case where the input is a single feature
  else if (isFeature(data)) {
    type = "Feature";
    funcimport = (d) => copy({ type: "FeatureCollection", features: [d] }); // Return a copy of the feature
    funcexport = (d) => (d.features.length == 1 ? d.features[0] : d.features);
  }
  // Case where the input is an array of geometries
  else if (isGeometries(data)) {
    type = "Geometries";
    funcimport = (d) =>
      copy({
        type: "FeatureCollection",
        features: d.map((geometry) => ({
          type: "Feature",
          properties: {},
          geometry: geometry,
        })),
      });
    funcexport = (d) => d.features.map((f) => f.geometry);
  }
  // Case where the input is a single geometry
  else if (isGeometry(data)) {
    type = "Geometry";
    funcimport = (d) =>
      copy({
        type: "FeatureCollection",
        features: [{ type: "Feature", properties: {}, geometry: d }],
      });
    funcexport = (d) =>
      d.features.length == 1
        ? d.features[0].geometry
        : d.features.map((d) => d.geometry);
  }
  // else if (isarrayofobjects(data)) {
  //   type = "Array of objects";
  //   funcimport = (d) =>
  //     copy({
  //       type: "FeatureCollection",
  //       features: d.map((e) => ({
  //         type: null,
  //         properties: e,
  //         geometry: null,
  //       })),
  //     });

  //   funcexport = (d) => d.features.map((f) => f.properties);
  // }
  else {
    type = undefined;
    funcimport = (d) => copy(d);
    funcexport = (d) => copy(d);
  }

  // Return the import/export functions
  return { type, import: funcimport, export: funcexport };
}

function copy(x) {
  return JSON.parse(JSON.stringify(x));
}
