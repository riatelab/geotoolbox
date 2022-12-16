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
