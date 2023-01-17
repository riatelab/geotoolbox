/**
 * Create a new GeoJSON FeatureCollection with the results
 * of a function call provided on each element
 * of GeoJSON properties (or geometries).
 *
 * The function returns a new GeoJSON FeatureCollection
 * and does not modify the initial GeoJSON Object.
 *
 * Example: {@link https://observablehq.com/@neocartocnrs/map-geojson?collection=@neocartocnrs/geotoolbox Observable notebook}
 *
 * @see the <code>filter</code> function
 *
 * @param {object} geojson - The FeatureCollection to iterate over
 * @param {function} func - The callback function to apply on each element
 * @param {string} [key=properties] - The key to apply the callback function on
 * @returns {{features: [{geometry:{}, type: string, properties: {}}], type: string}} - The new GeoJSON FeatureCollection
 */
export function map(geojson, func = (d) => d, key = "properties") {
  let x = { ...geojson };
  let features = x.features;
  let featureskeys = Array.from(
    new Set(features.map((d) => Object.keys(d)).flat())
  );

  let mykey = features.map((d) => d[key]).map(func);

  let newfeatures = [];
  features.forEach((d, i) => {
    let objfeat = {};
    featureskeys.forEach((x) => {
      objfeat = Object.assign(objfeat, { [x]: x == key ? mykey[i] : d[x] });
    });
    newfeatures.push(objfeat);
  });

  let obj = {};
  Object.keys(x).forEach((d) => {
    obj = Object.assign(obj, { [d]: d == "features" ? newfeatures : x[d] });
  });
  return obj;
}
