import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function filter
 * @description Filter a dataset. The functions allows to subset a geoJSON or an array of objects
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {string|function} [options.filter] - A function to filter the datset. But you can aslo use un string like "ISO3 = FRA" ou "pop > 1000"
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.filter(*a geojson or an array of objects*, {filter: "gdp >= 1000000" })
 */
export function filter(data, { filter, deepcopy = true } = {}) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  // geoJSON
  if (isgeojson(data)) {
    if (typeof filter == "function") {
      x.features = x.features.filter(filter);
    } else if (typeof filter == "string") {
      const prop = [
        ...new Set(
          x.features
            .map((d) => d.properties)
            .map((d) => Object.keys(d))
            .flat()
        ),
      ];
      const newprop = prop.map((d) => "d.properties['" + d + "']");

      const func =
        "d => " +
        replaceEquals(
          addQuotesIfString(
            prop.reduce(
              (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
              filter
            )
          )
        );

      console.log(func);

      x.features = x.features.filter(eval(func));
    }
  } else if (isarrayofobjects(data)) {
    if (typeof filter == "function") {
      x = x.filter(filter);
    } else if (typeof filter == "string") {
      const prop = [...new Set(x.map((d) => Object.keys(d)).flat())];
      const newprop = prop.map((d) => "d['" + d + "']");

      const func =
        "d => " +
        replaceEquals(
          addQuotesIfString(
            prop.reduce(
              (acc, mot, i) => acc.replace(new RegExp(mot, "g"), newprop[i]),
              filter
            )
          )
        );
      x = x.filter(eval(func));
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
