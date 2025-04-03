import { check } from "./helpers/check.js";

export async function map(data, { func = (d) => d } = {}) {
  const handle = check(data);
  let x = handle.import(data);
  x.features = await Promise.all(x.features.map(func));
  return handle.export(x);
}

export async function foreach(data, { func = (d) => d } = {}) {
  const handle = check(data);
  let x = handle.import(data);

  await Promise.all(x.features.map(async (d) => await func(d))); // Toujours attendre func

  return handle.export(x);
}
