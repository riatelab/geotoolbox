import { isFieldNumber } from "./helpers/isnumber";
import { descending, ascending } from "d3-array";
import { autoType } from "d3-dsv";
const d3 = Object.assign({}, { descending, ascending, autoType });

export let properties = {
  table,
  head,
  tail,
  autotype,
};

/**
 * @function properties/table
 * @description Return the attribute table of the GeoJSON FeatureCollection (i.e. the properties of each Feature).
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.properties.table(*a geojson*)
 */
export function table(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }
  return geojson?.features.map((d) => d?.properties);
}

/**
 * @function properties/autotype
 * @description Automatic type. The function detects common data types such as numbers, dates and booleans, and convert properties values to the corresponding JavaScript type.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.properties.autotype(*a geojson*)
 */
export function autotype(data, { deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  geojson.features = geojson.features.map((d) => ({
    ...d,
    properties: d3.autoType(
      Object.fromEntries(
        Object.entries(d.properties).map(([key, value]) => [key, String(value)])
      )
    ),
  }));

  return geojson;
}

/**
 * @function properties/head
 * @description Get the first n Features. The function returns a sorted geoJSON with the first nb features. If a field is selected, then the function returns the top values. If the entries are strings, then the alphabetic order is applied.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.nb = 6] - Number of features to return
 * @param {boolean} [options.field = true] - Field to sort
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.properties.head(*a geojson*)
 */
export function head(data, { field, nb = 6, deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let features = [...geojson.features];

  if (field != undefined) {
    features = features
      .filter((d) => d.properties[field] != "")
      .filter((d) => d.properties[field] != null)
      .filter((d) => d.properties[field] != undefined)
      .filter((d) => d.properties[field] != +Infinity)
      .filter((d) => d.properties[field] != -Infinity)
      .filter((d) => d.properties[field] != NaN);

    const mysort = isFieldNumber(geojson, field) ? d3.descending : d3.ascending;
    features = features.sort((a, b) =>
      mysort(
        d3.autoType([String(a.properties[field])])[0],
        d3.autoType([String(b.properties[field])])[0]
      )
    );
  }

  geojson.features = features.slice(0, nb);
  return geojson;
}

/**
 * @function properties/tail
 * @description Get the last n Features. The function returns a sorted geoJSON with the last nb features. If a field is selected, then the function returns the tail values. If the entries are strings, then the alphabetic order is applied.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.nb = 6] - Number of features to return
 * @param {boolean} [options.field = true] - Field to sort
 * @param {boolean} [options.deepcopy = true] - Use true to ensure that the input object is not modified and to create a new object.
 * @example
 * geotoolbox.properties.tail(*a geojson*)
 */
export function tail(data, { field, nb = 6, deepcopy = true } = {}) {
  // deep copy ?
  let geojson;
  if (deepcopy) {
    geojson = JSON.parse(JSON.stringify(data));
  } else {
    geojson = data;
  }

  let features = [...geojson.features];

  if (field != undefined) {
    features = features
      .filter((d) => d.properties[field] != "")
      .filter((d) => d.properties[field] != null)
      .filter((d) => d.properties[field] != undefined)
      .filter((d) => d.properties[field] != +Infinity)
      .filter((d) => d.properties[field] != -Infinity)
      .filter((d) => d.properties[field] != NaN);

    const mysort = isFieldNumber(geojson, field) ? d3.ascending : d3.descending;
    features = features.sort((a, b) =>
      mysort(
        d3.autoType([String(a.properties[field])])[0],
        d3.autoType([String(b.properties[field])])[0]
      )
    );
  }

  geojson.features = features.slice(0, nb);
  return geojson;
}
