import {
  isFieldNumber,
  isFieldNumber2,
  isgeojson,
  isarrayofobjects,
} from "./helpers/helpers";
import { descending, ascending } from "d3-array";
import { autoType } from "d3-dsv";
const d3 = Object.assign({}, { descending, ascending, autoType });

/**
 * @function tail
 * @summary Get the last n Features. The function sort data and returns the nb first elements. If a field is selected, then the function returns the top values. If the entries are strings, then the alphabetic order is applied.
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {number} [options.nb = 6] - Number of features to return
 * @param {boolean} [options.key = true] - Field to sort
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.tail(*a geojson or an array of objects*)
 */
export function tail(data, { key, nb = 6, mutate = false } = {}) {
  let x = data;

  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }
    let features = [...x.features];

    if (key != undefined) {
      features = features
        .filter((d) => d.properties[key] != "")
        .filter((d) => d.properties[key] != null)
        .filter((d) => d.properties[key] != undefined)
        .filter((d) => d.properties[key] != +Infinity)
        .filter((d) => d.properties[key] != -Infinity)
        .filter((d) => d.properties[key] != NaN);

      const mysort = isFieldNumber(x, key) ? d3.ascending : d3.descending;
      features = features.sort((a, b) =>
        mysort(
          d3.autoType([String(a.properties[key])])[0],
          d3.autoType([String(b.properties[key])])[0]
        )
      );
    }

    x.features = features.slice(0, nb);
  } else if (isarrayofobjects(x)) {
    if (key != undefined) {
      x = x
        .filter((d) => d[key] != "")
        .filter((d) => d[key] != null)
        .filter((d) => d[key] != undefined)
        .filter((d) => d[key] != +Infinity)
        .filter((d) => d[key] != -Infinity)
        .filter((d) => d[key] != NaN);

      const mysort = isFieldNumber2(x, field) ? ascending : descending;
      x = x.sort((a, b) =>
        mysort(
          d3.autoType([String(a[key])])[0],
          d3.autoType([String(b[key])])[0]
        )
      );
    }
    x = x.slice(0, nb);
    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }
  return x;
}
