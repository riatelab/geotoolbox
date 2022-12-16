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
