import initGeos from "geos-wasm";

let geosModule = null;

export async function geosloader() {
  if (!geosModule) {
    geosModule = await initGeos();
    console.log("GEOS loaded!");
  }
  return geosModule;
}
