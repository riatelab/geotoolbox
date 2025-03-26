import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

export function addproperty(
  data,
  { key = "_newkey", value, deepcopy = true } = {}
) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  // geojson

  const operators = /[+\-/*]/;
  const prop = [
    ...new Set(
      x.features
        .map((d) => d.properties)
        .map((d) => Object.keys(d))
        .flat()
    ),
  ];
  const n = x.features.length;

  if (
    typeof value == "number" ||
    (typeof value == "string" && !operators.test(value))
  ) {
    x.features.forEach((d) => {
      d.properties[key] = value;
    });
  } else if (typeof value == "function") {
    const values = x.features.map(value);
    x.features.forEach((d, i) => {
      d.properties[key] = values[i];
    });
  } else if (typeof value == "string" && operators.test(value)) {
    const newprop = prop.map((d) => "d.properties['" + d + "']");
    const functrsing =
      "d => " +
      prop.reduce(
        (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
        value
      );
    const values = x.features.map(eval(functrsing));
    x.features.forEach((d, i) => {
      d.properties[key] = values[i];
    });
  }

  return x;
}
