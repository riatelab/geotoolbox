import { isgeojson, isarrayofobjects } from "./helpers/helpers";
export function dataformat(data, { properties, rename, deepcopy = true } = {}) {
  // deep copy ?
  let x;
  if (deepcopy) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  if (isgeojson(x)) {
    if (properties != undefined && Array.isArray(properties)) {
      // Rename ?
      if (
        rename != undefined &&
        Array.isArray(rename) &&
        rename.length == properties.length
      ) {
        // Select and rename properties
        const fields = properties.map((d, i) => [d, rename[i]]);
        x.features.forEach((d) => {
          d.properties = Object.fromEntries(
            fields.map((k) => [k[1], d?.properties[k[0]]])
          );
        });
      } else {
        // Select properties
        x.features.forEach((d) => {
          d.properties = Object.fromEntries(
            properties.map((k) => [k, d?.properties[k]])
          );
        });
      }
    }
  } else if (isarrayofobjects(x)) {
  }

  return x;
}
