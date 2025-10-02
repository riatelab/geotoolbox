import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function filter
 * @summary Filter a dataset. The functions allows to subset a geoJSON or an array of objects
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {string|function} [options.func] - A function to filter the datset. But you can aslo use un string like "ISO3 = FRA" ou "pop > 1000"
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @example
 * geotoolbox.filter(*a geojson or an array of objects*, {func: "gdp >= 1000000" })
 */
export function filter(data, { func, mutate = false } = {}) {
  let x = data;
  // geoJSON
  if (isgeojson(data)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }

    if (typeof func == "function") {
      x.features = x.features.filter(func);
    } else if (typeof func == "string") {
      const prop = [
        ...new Set(
          x.features
            .map((d) => d.properties)
            .map((d) => Object.keys(d))
            .flat()
        ),
      ];
      const newprop = prop.map((d) => "d.properties['" + d + "']");

      func =
        "d => " +
        replaceEquals(
          addQuotesIfString(
            prop.reduce(
              (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
              func
            )
          )
        );

      x.features = x.features.filter(eval(func));
    }
  } else if (isarrayofobjects(data)) {
    if (typeof func == "function") {
      x = x.filter(func);
    } else if (typeof func == "string") {
      const prop = [...new Set(x.map((d) => Object.keys(d)).flat())];
      const newprop = prop.map((d) => "d['" + d + "']");

      const func =
        "d => " +
        replaceEquals(
          addQuotesIfString(
            prop.reduce(
              (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
              func
            )
          )
        );
      x = x.filter(eval(func));
    }

    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }

  return x;
}

function replaceEquals(str) {
  return str.replace(/(?<![><!])=(?![=])/g, "==");
}

function addQuotesIfString(expression) {
  return expression.replace(
    /([><=!]=?|==)\s*([A-Za-z_]+)/g,
    (match, operator, value) => {
      return `${operator} '${value}'`;
    }
  );
}
