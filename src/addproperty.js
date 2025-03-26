import { str2fun, isarrayofobjects, isgeojson } from "./helpers/helpers.js";

export function addproperty(data, { key, value, deepcopy = true } = {}) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }
  let properties;
  if (isgeojson(x)) {
    properties = x.features.map((d) => d.properties);
  } else if (isarrayofobjects(x)) {
    properties = x.map((d) => d);
  }
  let keys = [];
  properties.forEach((d) => {
    keys.push(Object.keys(d));
  });
  keys = Array.from(new Set(keys.flat()));

  let newfield;
  if (typeof value == "function") {
    newfield = x.map(value);
  } else if (typeof value == "string") {
    keys.forEach((d) => {
      value = value.replace(d, `d.${d}`);
    });
    value = "d=>" + value;
    newfield = x.map(str2fun(value));
  } else if (typeof value == "number") {
    newfield = x.map((d) => value);
  }
  return newfield;

  // keys.forEach((d) => {
  //   expression = expression.replace(d, `d.${d}`);
  // });
  // expression = "d=> " + expression;
  //let newfield = data.map(str2fun(expression));
  // let newfield = data.map((d) => d.pop / d.gdp);
  // data.forEach((d, i) => {
  //   d = Object.assign(d, { [field]: newfield[i] });
  // });
  // let output = JSON.parse(JSON.stringify(x));
  // output.features.map((d, i) => (d.properties = { ...data[i] }));
  // return output;
}
