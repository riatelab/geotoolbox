import { geoArea, geoCentroid, geoIdentity, geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoArea, geoCentroid, geoIdentity, geoPath });

/**
 * @function centroid
 * @summary Calculates the centroids of geometries.
 * @description Based on `d3.geoArea()` and `d3.geoCentroid()`
 * @param {object} data - A GeoJSON FeatureCollection.
 * @param {object} options - Optional parameters.
 * @param {boolean} [options.larget = true] - If true, set the point at the centre of the largest polygon.
 * @param {boolean} [options.geo = true] - Use true to consider the centroid from world coordinates on the globe. If you use false, then you are considering the coordinates within the svg document.
 * @param {boolean} [options.mutate = false] - Use `true` to update the input data. With false, you create a new object, but the input object remains the same.
 * @example
 * geotoolbox.centroid(*a geojson*, {largest: true})
 */

export function centroid(
  data,
  { largest = true, geo = true, mutate = false } = {}
) {
  let x;
  if (!mutate) {
    x = JSON.parse(JSON.stringify(data));
  } else {
    x = data;
  }

  let path = d3.geoPath(d3.geoIdentity());

  function largestPolygon(d) {
    var best = {};
    var bestArea = 0;
    d.geometry.coordinates.forEach(function (coords) {
      var poly = { type: "Polygon", coordinates: coords };
      var area = geo ? d3.geoArea(poly) : path.area(poly);
      if (area > bestArea) {
        bestArea = area;
        best = poly;
      }
    });
    return best;
  }

  let centers = x.features.map((d) => {
    if (geo) {
      d.geometry.coordinates = d3.geoCentroid(
        largest == true
          ? d.geometry.type == "Polygon"
            ? d
            : largestPolygon(d, true)
          : d
      );
    } else {
      d.geometry.coordinates = path.centroid(
        largest == true
          ? d.geometry.type == "Polygon"
            ? d
            : largestPolygon(d, false)
          : d
      );
    }

    d.geometry.type = "Point";
    return d;
  });

  x.features = centers;
  return x;
}
