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
 * @description Get the last n Features. The function sort data and returns the nb first elements. If a field is selected, then the function returns the top values. If the entries are strings, then the alphabetic order is applied.
 * @param {object|array} data - a GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {number} [options.nb = 6] - Number of features to return
 * @param {boolean} [options.field = true] - Field to sort
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.tail(*a geojson or an array of objects*)
 */
export function tail(data, { field, nb = 6, deepcopy = true } = {}) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isgeojson(x)) {
    let features = [...x.features];

    if (field != undefined) {
      features = features
        .filter((d) => d.properties[field] != "")
        .filter((d) => d.properties[field] != null)
        .filter((d) => d.properties[field] != undefined)
        .filter((d) => d.properties[field] != +Infinity)
        .filter((d) => d.properties[field] != -Infinity)
        .filter((d) => d.properties[field] != NaN);

      const mysort = isFieldNumber(x, field) ? d3.ascending : d3.descending;
      features = features.sort((a, b) =>
        mysort(
          d3.autoType([String(a.properties[field])])[0],
          d3.autoType([String(b.properties[field])])[0]
        )
      );
    }

    x.features = features.slice(0, nb);
  } else if (isarrayofobjects(x)) {
    if (field != undefined) {
      x = x
        .filter((d) => d[field] != "")
        .filter((d) => d[field] != null)
        .filter((d) => d[field] != undefined)
        .filter((d) => d[field] != +Infinity)
        .filter((d) => d[field] != -Infinity)
        .filter((d) => d[field] != NaN);

      const mysort = isFieldNumber2(x, field) ? ascending : descending;
      x = x.sort((a, b) =>
        mysort(
          d3.autoType([String(a[field])])[0],
          d3.autoType([String(b[field])])[0]
        )
      );
    }
    x = x.slice(0, nb);
  }
  return x;
}
