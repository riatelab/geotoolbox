import { str2fun } from "../helpers/helpers.js";

/**
 * @function <s>properties/select</s>
 * @deprecated
 * @summary From now on, use {@link filter}
 */
export function select({ x, expression }) {
  let features = [...x.features];

  // Get keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  keys.forEach((d) => {
    expression = expression.replace(d, `d.properties.${d}`);
  });

  expression = "d => " + expression;

  let output = JSON.parse(JSON.stringify(x));
  output.features = features.filter(str2fun(expression));
  return output;
}
