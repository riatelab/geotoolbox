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

export function groupby(
  data,
  { by, keys = "_newkey", operators, mutate = false } = {}
) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isgeojson(x)) {
    // Stuffs on geoJSONS
  } else if (isarrayofobjects(x)) {
  }
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
