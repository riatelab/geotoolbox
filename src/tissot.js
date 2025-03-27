import { geoCircle } from "d3-geo";

/**
 * @function tissot
 * @summary Generate Tissot's indicatrix.
 * @param {number} [step = 20] - The distance between each circle
 * @example
 * geotoolbox.tissot(*a geojson*)
 */

export function tissot(step = 20) {
  const circle = geoCircle()
    .center((d) => d)
    .radius(step / 4)
    .precision(10);
  const features = [];
  for (let y = -80; y <= 80; y += step) {
    for (let x = -180; x < 180; x += step) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiPolygon",
          coordinates: [circle([x, y]).coordinates],
        },
      });
    }
  }

  return { type: "FeatureCollection", features: features };
}
