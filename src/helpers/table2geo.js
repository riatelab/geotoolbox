export function table2geo(arr, lat, lon, coords, reverse) {
  // check fields
  let keys = [];
  arr.forEach((d) => keys.push(Object.keys(d)));
  keys = Array.from(new Set(keys.flat()));
  if (lat == undefined) {
    lat = ["lat", "Lat", "LAT", "Latitude", "latitude"].filter((d) =>
      keys.includes(d)
    )[0];
  }

  if (lon == undefined) {
    lon = [
      "lon",
      "Lon",
      "LON",
      "lng",
      "Lng",
      "LNG",
      "Longitude",
      "longitude",
    ].filter((d) => keys.includes(d))[0];
  }
  if (coords == undefined) {
    coords = [
      "coords",
      "Coords",
      "coord",
      "Coords",
      "Coordinates",
      "coordinates",
      "Coordinate",
      "coordinate",
    ].filter((d) => keys.includes(d))[0];
  }

  // case1: lat & lng coords in separate columns
  if (lat && lon) {
    let x = lat;
    let y = lon;

    return {
      type: "FeatureCollection",
      features: arr.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: reverse
            ? [parseFloat(d[x]), parseFloat(d[y])]
            : [parseFloat(d[y]), parseFloat(d[x])],
        },
      })),
    };
  }

  // case2: lat & lng coords in a single column

  if (coords) {
    return {
      type: "FeatureCollection",
      features: arr.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: reverse
            ? getcoords(d[coords])
            : getcoords(d[coords]).reverse(),
        },
      })),
    };
  }

  return coords;
}

function txt2coords(str, sep = ",") {
  str = str.replace(/[ ]+/g, "");
  let coords = str
    .split(sep)
    .map((d) => d.replace(",", "."))
    .map((d) => d.replace(/[^\d.-]/g, ""))
    .map((d) => +d);

  if (coords.length != 2) {
    coords = [undefined, undefined];
  }
  return coords;
}

function wkt2coords(str) {
  let result = str.match(/\(([^)]+)\)/g);
  return result === null
    ? [undefined, undefined]
    : result[0]
        .replace(/\s\s+/g, " ")
        .replace("(", "")
        .replace(")", "")
        .trimStart()
        .trimEnd()
        .split(" ")
        .map((d) => d.replace(",", "."))
        .map((d) => +d);
}

function getcoords(str) {
  return str
    ? str.toLowerCase().includes("point")
      ? wkt2coords(str)
      : txt2coords(str)
    : null;
}
