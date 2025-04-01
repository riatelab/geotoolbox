import initGeosJs from "geos-wasm";
let geosPromise = initGeosJs(); // Chargement immédiat de GEOS
export async function getGeos() {
  return await geosPromise; // Retourne l'instance quand elle est prête
}
