export function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    typeof value !== "boolean" &&
    isFinite(value)
  );
}

export function isFieldNumber(data, field) {
  const test = data.features.map((d) => isNumber(d.properties[field]));
  const nb = test.filter((d) => d === true).length;
  return nb > test.length / 2 ? true : false;
}
