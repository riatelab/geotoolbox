/**
 * Create and return a new GeoJSON FeatureCollection containing all
 * the elements of the original GeoJSON FeatureCollection that meet a condition
 * determined by the callback function applied on properties (or geometries).
 *
 * The function returns a new GeoJSON FeatureCollection and does not modify the initial GeoJSON Object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/filter-geojson?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @see the <code>map</code> function
 *
 * @param {object} geojson - The FeatureCollection to iterate over
 * @param {function} func - The callback function to apply on each element
 * @param {string} [key=properties] - The key to apply the callback function on
 */
export function filter(geojson, func = (d) => d, key = "properties") {
  let x = { ...geojson };
  let features = x.features;
  let featureskeys = Array.from(
    new Set(features.map((d) => Object.keys(d)).flat())
  );

  let newfeatures = [];
  features.forEach((d, i) => {
    let result = [d[key]].filter(func);
    if (result.length != 0) {
      newfeatures.push(d);
    }
  });

  let obj = {};
  Object.keys(x).forEach((d) => {
    obj = Object.assign(obj, { [d]: d == "features" ? newfeatures : x[d] });
  });
  return obj;
}
