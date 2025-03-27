/**
 * @function <s>properties/head</s>
 * @deprecated
 * @summary From now on, use {@link head}
 */
export function head({ x, field, nb = 10 }) {
  let features = [...x.features];
  features = features
    .filter((d) => d.properties[field] != "")
    .filter((d) => d.properties[field] != null)
    .filter((d) => d.properties[field] != undefined)
    .filter((d) => d.properties[field] != +Infinity)
    .filter((d) => d.properties[field] != -Infinity)
    .filter((d) => d.properties[field] != NaN);

  let head = features.sort(
    (a, b) => +b.properties[field] - +a.properties[field]
  );
  features = features.slice(0, nb);
  let output = JSON.parse(JSON.stringify(x));
  output.features = features;
  return output;
}
