export function geomtypes(x) {
  let types = Array.from(
    new Set(
      x.features.filter((d) => d.geometry !== null).map((d) => d.geometry.type)
    )
  );

  return types;
}
