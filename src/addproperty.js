import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function addproperty
 * @description Add a field to a dataset. The function allows to add a new property
 * @param {object|array} data - a GeoJSON FeatureCollection or an array of objects
 * @param {object} options - optional parameters
 * @param {string} [options.key = "_newkey"] - name of the property
 * @param {number|string|function} [options.value] - you can set a simple number or string. You can also specify a function like `d=> d.properties.gdp/d.properties.pop * 1000`. With the *, +, - and / operators, you can also directly write `“gdp/pop*100”`.
 * @param {boolean} [options.deepcopy = true] - use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.add(*a geojson or an array of objects*, {key: "gdppc", value:"gdp/pop"})
 */
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

  const operators = /[+\-/*]/;

  // geojson
  if (isgeojson(data)) {
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
      const prop = [
        ...new Set(
          x.features
            .map((d) => d.properties)
            .map((d) => Object.keys(d))
            .flat()
        ),
      ];
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
  }

  // Array of objects
  else if (isarrayofobjects(data)) {
    const n = x.length;

    if (
      typeof value == "number" ||
      (typeof value == "string" && !operators.test(value))
    ) {
      x.forEach((d) => {
        d[key] = value;
      });
    } else if (typeof value == "function") {
      const values = x.map(value);
      x.forEach((d, i) => {
        d[key] = values[i];
      });
    } else if (typeof value == "string" && operators.test(value)) {
      const prop = [...new Set(x.map((d) => Object.keys(d)).flat())];
      const newprop = prop.map((d) => "d['" + d + "']");

      const functrsing =
        "d => " +
        prop.reduce(
          (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
          value
        );
      const values = x.map(eval(functrsing));

      x.forEach((d, i) => {
        d[key] = values[i];
      });
    }
  }

  return x;
}
