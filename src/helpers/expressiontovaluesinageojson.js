import { isNumber } from "./helpers.js";

export function expressiontovaluesinageojson(geojson, input) {
  const operators = /[+\-/*]/;

  if (isNumber(input)) {
    return geojson.features.map((d) => input);
  } else if (typeof input == "function") {
    return geojson.features.map(input);
  } else if (typeof input == "string") {
    const prop = [
      ...new Set(geojson.features.map((d) => Object.keys(d.properties)).flat()),
    ];

    const newprop = prop.map((d) => "d.properties['" + d + "']");
    const functrsing =
      "d => " +
      prop.reduce(
        (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
        input
      );
    const values = geojson.features.map(eval(functrsing));
    return values;
  }

  // if()

  // if (operators.test(str)) {
  // }
}
