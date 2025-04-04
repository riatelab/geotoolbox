import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function derive
 * @summary Add a field to a dataset. The function allows to add a new property
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {string} [options.key = "_newkey"] - Name of the property
 * @param {number|string|function} [options.value] - You can set a simple number or string. You can also specify a function like `d=> d.properties.gdp/d.properties.pop * 1000`. With the *, +, - and / operators, you can also directly write `“gdp/pop*100”`.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @example
 * geotoolbox.derive(*a geojson or an array of objects*, {key: "gdppc", value:"gdp/pop"})
 */
export function derive(data, { key = "_newkey", value, mutate = false } = {}) {
  // deep copy ?
  let x = data;
  const operators = /[+\-/*]/;

  // geojson
  if (isgeojson(data)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }
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

    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }

  return x;
}
