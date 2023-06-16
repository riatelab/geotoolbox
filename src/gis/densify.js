import jsts from "jsts/dist/jsts.min.js";
import { featurecollection } from "../utils/featurecollection.js";

/**
 * Densify a geoJSON
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/densify?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 * @returns {{features: {geometry: {}, type: string, properties: {}}[], type: string}} - The resulting GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number|string} options.dist - The minimal distance between nodes
 *
 */

export function densify(x, options = {}) {
  // Parameters
  let dist = options.dist ? options.dist : 1;
  let reader = new jsts.io.GeoJSONReader();
  let writer = new jsts.io.GeoJSONWriter();
  let data = reader.read(featurecollection(x));

  let features = [];
  data.features.forEach((d) => {
    let dens = jsts.densify.Densifier.densify(d.geometry, dist);
    dens = writer.write(dens);
    if (dens.coordinates[0].length !== 0) {
      features.push({
        type: "Feature",
        properties: d.properties,
        geometry: dens,
      });
    }
  });
  return { type: "FeatureCollection", features: features };
}
