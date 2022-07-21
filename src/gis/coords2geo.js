export function coords2geo(data, options = {}) {
  let arr = JSON.parse(JSON.stringify(data));

  let lat = options.lat || options.latitude;
  let lon = options.lon || options.lng || options.longitude;
  let coords = options.coords || options.coordinates;
  let sep =
    options.sep || options.separator ? options.sep || options.separator : ",";
  let reverse = options.reverse ? true : false;

  // check fields
  if (lat == undefined && lon == undefined && coords == undefined) {
    let checkcoords = [
      "coords",
      "Coords",
      "coord",
      "Coords",
      "Coordinates",
      "coordinates",
      "Coordinate",
      "coordinate",
    ];
    let checklat = ["lat", "Lat", "LAT", "Latitude", "latitude"];
    let checklon = [
      "lon",
      "Lon",
      "LON",
      "lng",
      "Lng",
      "LNG",
      "Longitude",
      "longitude",
    ];

    let keys = [];
    arr.forEach((d) => keys.push(Object.keys(d)));
    keys = Array.from(new Set(keys.flat()));

    lat = checklat.filter((d) => keys.includes(d))[0];
    lon = checklon.filter((d) => keys.includes(d))[0];
    coords = checkcoords.filter((d) => keys.includes(d))[0];
  }

  // case1: lat & lng coords in separate columns
  if (lat && lon) {
    let x = reverse ? lon : lat;
    let y = reverse ? lat : lon;

    return {
      type: "FeatureCollection",
      features: data.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: [+d[y], +d[x]],
        },
      })),
    };
  }

  // case2: lat & lng coords in a single column
  if (coords) {
    return {
      type: "FeatureCollection",
      features: data.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: reverse
            ? txt2coords(d[coords], sep)
            : txt2coords(d[coords], sep).reverse(),
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
