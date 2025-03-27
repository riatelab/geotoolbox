import { remove } from "./remove.js";

/**
 * @function <s>properties/keep</s>
 * @deprecated
 * @summary From now on, use {@link columns}
 */
export function keep({ x, fields }) {
  // Get all keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  // Fields to be removed
  let diff = keys.filter((k) => !fields.includes(k));
  return remove({ x, field: diff });
}
