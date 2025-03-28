import { isgeojson } from "./helpers/helpers.js";
import { dedupe } from "./dedupe.js";

/**
 * @function join
 * @summary Join datasets using a common identifier.
 * @param {object} parameters - Parameters
 * @param {array} [parameters.data] - an array of geojson or arrays of objects
 * @param {array} [parameters.ids] - an array of code of the same size
 * @param {boolean} [parameters.removemergedgeometries = true] - If you use more than one geojson, delete the joined geometries. If you use false, then they will be included in the properties. But if the merge parameter is set to true, then all geometries are kept in a single field.
 * @param {boolean} [parameters.notemptygeom = true] - keep only data with geometries (if one ore more of your input data is a geoJSON).
 * @example
 * geotoolbox.join({data: [*a geojson*, *a dataset*], ids:["ISO3", "id"])
 */
export function join({
  data,
  ids,
  notemptygeom = true,
  removemergedgeometries = true,
} = {}) {
  // --------------
  // Data Handling
  // --------------

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

  // Dedupe
  const check = data.map((d, i) => {
    const arr = d.map((d) => d[ids[i]]);
    return [...new Set(arr)].length < arr.length;
  });

  // Unique Fields
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

  // --------
  // Join All
  // --------

  // Join
  let output = data[0];
  for (let i = 1; i < data.length; i++) {
    output = mergeArrays(output, data[i], ids[0], ids[i]);
  }

  // Fill keys
  let prop = [...new Set(output.map((d) => Object.keys(d)).flat())];
  output = output.map((obj) =>
    Object.fromEntries(prop.map((key) => [key, obj[key]]))
  );

  // ------
  // Clean
  // ------

  if (removemergedgeometries) {
    output = removeKeys(
      output,
      Array.from(
        { length: data.length - 1 },
        (_, i) => `${"_".repeat(i + 1)}#geometry#`
      )
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
    if (notemptygeom) {
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

// --------------------------
// HELPERS
// ---------------------------

function uniqueIdentifiersNested(arr) {
  const count = new Map();
  return arr.map((subArr) =>
    subArr.map((item) => {
      const prefix = "_".repeat(count.get(item) || 0);
      count.set(item, (count.get(item) || 0) + 1);
      return prefix + item;
    })
  );
}

function replaceIdKeyInPlace(arr, oldId, newId) {
  arr.forEach((obj) => {
    if (obj && typeof obj === "object" && oldId in obj) {
      obj[newId] = obj[oldId]; // Copier la valeur
      //delete obj[oldId]; // Supprimer l'ancienne clé
    }
  });
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

function mergeArrays_old(arr1, arr2, key1, key2) {
  const map = new Map();
  arr1.forEach((obj) => map.set(obj[key1], { ...obj }));
  arr2.forEach((obj) => {
    const matchKey = obj[key2];
    if (map.has(matchKey)) {
      Object.assign(map.get(matchKey), obj);
    } else {
      map.set(matchKey, { ...obj });
    }
  });
  return Array.from(map.values());
}

function mergeArrays(arr1, arr2, key1, key2) {
  // Fusionner arr1 et arr2 (left join)
  const result = arr1.map((obj1) => {
    const matchedObj = arr2.find((obj2) => obj2[key2] === obj1[key1]);
    return matchedObj ? { ...obj1, ...matchedObj } : { ...obj1 };
  });

  // Ajouter les objets de arr2 qui ne sont pas dans arr1
  arr2.forEach((obj2) => {
    if (!arr1.some((obj1) => obj1[key1] === obj2[key2])) {
      result.push({ ...obj2 });
    }
  });

  return result;
}

function removeKeys(objects, keysToRemove) {
  return objects.map((obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
    )
  );
}
