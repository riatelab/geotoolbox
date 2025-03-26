import { implantation } from "./helpers/implantation.js";
import { geomtypes } from "./helpers/helpers";

/**
 * @function info
 * @description GeoJSON information. The function gives some informations about a geoJSON (size, number of nodes, type of features, etc)
 * @param {object} data - a GeoJSON FeatureCollection
 * @example
 * geottolbox.info(*a geojson*)
 */

export function info(data) {
  const weight = (
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    }).size / 1024
  ).toFixed(0);

  const nodes =
    data.features
      .map((d) => d.geometry.coordinates)
      .flat(4)
      .filter((d) => d !== undefined).length / 2;
  0;

  const accessor = new Map([
    [1, "point"],
    [2, "line"],
    [3, "poly"],
  ]);

  const type = implantation(data);

  return {
    type: accessor.get(type),
    geometries: geomtypes(data),
    properties,
    weight: "~" + weight + " KO",
    nodes,
  };
}
