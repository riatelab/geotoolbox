import { isgeojson } from "./helpers/helpers.js";
import { combine } from "./combine.js";

/**
 * @function join
 * @summary Join datasets using a common identifier.
 * @param {array} data - An array of datsats and/or geoJSONs. The join operation is basend on the first item.
 * @param {object} options - Options
 * @param {array|string} [options.ids] - An array of code of the same size. You can use a single string if all the ids have the same code. If the ids are not filled in, then the datasets are combined without a join.
 * @param {boolean} [options.merge = false] - Use `true` to merge fields with the same name
 * @param {boolean} [options.all = true] - Use `true` to keep all elements.
 * @param {boolean} [options.emptygeom = true] - Use `false` to keep only data with geometries (if one ore more of your input data is a geoJSON).
 * @param {boolean} [options.fillkeys = true] - Use `true` to ensure that all features have all properties.
 * @returns {object|array} -  A GeoJSON FeatureCollection or an array of objects. (it depends on what you've set as `data`).
 * @example
 * geotoolbox.join([*a geojson*, *a dataset*], {ids:["ISO3", "id"], all: false)
 */
export function join(
  data,
  { ids, merge = false, emptygeom = true, all = true, fillkeys = true } = {}
) {
  // --------------
  // Data Handling
  // --------------

  // If !ids => conbine()
  if (ids == undefined) {
    return combine(data);
  } else {
    // Else process join

    // Deepcopy & geojson to flat array
    data = data.map((d) =>
      isgeojson(d)
        ? structuredClone(
            d.features.map((d) => ({
              ...d?.properties,
              ["#geometry#"]: d.geometry,
            }))
          )
        : structuredClone(d)
    );

    // ids

    if (typeof ids == "string") {
      ids = Array(data.length).fill(ids);
    }

    // Unique Fields

    if (!merge) {
      let keys = [];
      data.forEach((d) => {
        keys.push([...new Set(d.map((d) => Object.keys(d)).flat())]);
      });

      let uniquekeys = uniqueIdentifiersNested(keys);

      let newoldids = ids.map((d, i) => [
        d,
        uniquekeys[i][keys[i].indexOf(ids[i])],
      ]);

      ids = newoldids.map((d) => d[1]);
      data = renameKeysInArrays(data, uniquekeys);
    }
    // --------
    // Join All
    // --------

    // Join
    let output = data[0];
    for (let i = 1; i < data.length; i++) {
      output = mergeArrays(output, data[i], ids[0], ids[i], all);
    }

    // Fill
    if (fillkeys) {
      let prop = [...new Set(output.map((d) => Object.keys(d)).flat())];
      output = output.map((obj) =>
        Object.fromEntries(prop.map((key) => [key, obj[key]]))
      );
    }

    // ----------------------------------------
    // Rebuild a dataset (if #geometry# field)
    // ----------------------------------------

    if (
      [...new Set(output.map((d) => Object.keys(d)).flat())].includes(
        "#geometry#"
      )
    ) {
      if (!emptygeom) {
        output = output.filter((d) => d["#geometry#"] !== undefined);
      }

      const newprop = removeKeys(output, "#geometry#");
      let features = output.map((d, i) => ({
        type: "Feature",
        properties: newprop[i],
        geometry: d["#geometry#"],
      }));
      output = { type: "FeatureCollection", features };
    }

    return output;
  }
}

// --------------------------
// HELPERS
// ---------------------------

function uniqueIdentifiersNested(arr) {
  const count = new Map();
  return arr.map((subArr) =>
    subArr.map((item) => {
      if (item === "#geometry#") return item;
      const prefix = "_".repeat(count.get(item) || 0);
      count.set(item, (count.get(item) || 0) + 1);
      return prefix + item;
    })
  );
}

function renameKeysInArrays(arraysOfObjects, keysToReplace) {
  return arraysOfObjects.map((array, index) => {
    return array.map((obj) => {
      let newObj = {};
      let keyMap = keysToReplace[index];

      Object.keys(obj).forEach((key, i) => {
        let newKey = keyMap[i] || key; // Remplace la clé si une correspondance existe
        newObj[newKey] = obj[key];
      });

      return newObj;
    });
  });
}

function mergeArrays(arr1, arr2, key1, key2, all) {
  // Marge arr1 et arr2 (left join)
  const result = arr1.map((obj1) => {
    const matchedObj = arr2.find((obj2) => {
      const val1 = obj1[key1];
      const val2 = obj2[key2];
      return !isEmpty(val1) && !isEmpty(val2) && val1 === val2;
    });
    return matchedObj ? { ...obj1, ...matchedObj } : { ...obj1 };
  });

  // Add arr2 objects if they are not in arr1
  if (all) {
    arr2.forEach((obj2) => {
      const val2 = obj2[key2];
      if (
        !arr1.some((obj1) => {
          const val1 = obj1[key1];
          return !isEmpty(val1) && !isEmpty(val2) && val1 === val2;
        })
      ) {
        result.push({ ...obj2 });
      }
    });
  }

  return result;
}

function removeKeys(objects, keysToRemove) {
  return objects.map((obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
    )
  );
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}
