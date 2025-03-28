import { isgeojson, isarrayofobjects } from "./helpers/helpers";
import { descending, ascending } from "d3-array";
import { autoType } from "d3-dsv";
const d3 = Object.assign({}, { descending, ascending, autoType });

/**
 * @function sort
 * @summary Sorting data according to a field
 * @param {object|array} data - A GeoJSON FeatureCollection or an array of objects
 * @param {object} options - Optional parameters
 * @param {array} [options.key ] - Field on which sorting is performed
 * @param {array} [options.ascending = false] - To change the sort order
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.sort(*a geojson or an array of objects*, {key: "ISO3", ascending: true})
 */

export function sort(data, { key, ascending = true, mutate = false } = {}) {
  let x = data;
  const test = ["", null, undefined, +Infinity, -Infinity, NaN];

  if (isgeojson(x)) {
    if (!mutate) {
      x = JSON.parse(JSON.stringify(data));
    }

    if (key != undefined) {
      let featurestosort = x.features.filter(
        (d) => !test.includes(d?.properties[key])
      );
      let rest = x.features.filter((d) => test.includes(d?.properties[key]));

      const mysort = ascending ? d3.ascending : d3.descending;
      featurestosort = featurestosort.sort((a, b) =>
        mysort(
          d3.autoType([String(a.properties[key])])[0],
          d3.autoType([String(b.properties[key])])[0]
        )
      );
      x.features = [...featurestosort, ...rest];
    }
  } else if (isarrayofobjects(x)) {
    if (key != undefined) {
      let xtosort = x.filter((d) => !test.includes(d[key]));
      let rest = x.filter((d) => test.includes(d[key]));
      const mysort = ascending ? d3.ascending : d3.descending;
      xtosort = xtosort.sort((a, b) =>
        mysort(
          d3.autoType([String(a[key])])[0],
          d3.autoType([String(b[key])])[0]
        )
      );
      x = [...xtosort, ...rest];
    }

    if (mutate) {
      data.splice(0, data.length, ...x);
    }
  }

  return x;
}
