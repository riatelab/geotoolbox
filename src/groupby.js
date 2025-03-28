import { aggregate } from "./aggregate.js";
import {
  sum,
  min,
  max,
  mode,
  median,
  mean,
  variance,
  deviation,
} from "d3-array";

const d3 = Object.assign(
  {},
  { sum, min, max, mode, median, mean, variance, deviation }
);
import { isarrayofobjects, isgeojson } from "./helpers/helpers.js";

/**
 * @function groupby
 * @summary This function allows you to group objects according to an identifier. If the input dataset is a geoJSON, then the geometries are grouped using the aggregate function.
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {array} [options.keys] - Properties to be retained after regrouping. By default, all properties are kept.
 * @param {array} [options.operators] - Functions to be applied to each variable. You can enter any function to be applied to an array. You can also enter operators directly: `"all"` (to retrieve all values), `"count"`, `"sum"`, `"min"`, `"max"`, `"median"`, `"mode"`, `"mean"`, `"first"`, `"last"`, `"variance"` and `"deviation"`.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.derive(*a geojson or an array of objects*, {key: "gdppc", value:"gdp/pop"})
 */
export function groupby(data, { by, keys, operators, mutate = false } = {}) {
  let x = data;

  if (isgeojson(x) && by !== undefined) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }

    const prop =
      keys ||
      [
        ...new Set(x?.features.map((d) => Object.keys(d?.properties)).flat()),
      ].filter((d) => d !== by);
    const op = operators || Array(prop.length).fill("all");
    const func = new Map(
      prop.map((d, i) => [
        d,
        typeof op[i] === "function" ? op[i] : compute(op[i]),
      ])
    );
    const ids = removeempty([
      ...new Set(x?.features.map((d) => d?.properties[by])),
    ]);

    let features = [];
    ids.forEach((categ) => {
      const subset = x?.features.filter((d) => d?.properties[by] == categ);
      const properties = { [by]: categ };
      prop.forEach((p) => {
        properties[p] = func.get(p)(subset.map((d) => d?.properties[p]));
      });

      features.push({
        type: "Feature",
        properties,
        geometry: aggregate({ features: subset }, { id: categ }).features[0]
          .geometry,
      });
    });
    x.features = features;

    // -------------------------
  } else if (isarrayofobjects(x) && by !== undefined) {
    const prop =
      keys ||
      [...new Set(x.map((d) => Object.keys(d)).flat())].filter((d) => d !== by);
    const op = operators || Array(prop.length).fill("all");
    const func = new Map(
      prop.map((d, i) => [
        d,
        typeof op[i] === "function" ? op[i] : compute(op[i]),
      ])
    );
    const ids = removeempty([...new Set(x.map((d) => d[by]))]);

    let arr = [];
    ids.forEach((categ) => {
      const subset = x.filter((d) => d[by] == categ);
      const obj = { [by]: categ };
      prop.forEach((p) => {
        obj[p] = func.get(p)(subset.map((d) => d[p]));
      });
      arr.push(obj);
    });
    x = arr;
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}

// helpers

function compute(op) {
  switch (op) {
    case "all":
      return function (arr) {
        return arr;
      };
      break;
    case "count":
      return function (arr) {
        return arr.length;
      };
      break;
    case "sum":
      return function (arr) {
        return d3.sum(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    case "min":
      return function (arr) {
        return d3.min(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    case "max":
      return function (arr) {
        return d3.max(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    case "mode":
      return function (arr) {
        return d3.mode(removeempty(arr.map((d) => parseFloat(d))));
      };
    case "median":
      return function (arr) {
        return d3.median(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;

    case "mean":
      return function (arr) {
        return d3.mean(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    case "first":
      return function (arr) {
        return removeempty(arr)[0];
      };
    case "last":
      return function (arr) {
        return removeempty(arr).at(-1);
      };
      break;

    case "variance":
      return function (arr) {
        return d3.variance(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    case "deviation":
      return function (arr) {
        return d3.deviation(removeempty(arr.map((d) => parseFloat(d))));
      };
      break;
    default:
      // all
      return arr;
  }
}

function removeempty(x) {
  return x.filter(
    (d) =>
      !["  ", " ", "", undefined, null, NaN, Infinity, -Infinity].includes(d)
  );
}
