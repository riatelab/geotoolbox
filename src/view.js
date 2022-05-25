import * as L from "leaflet";

const url = "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css";
document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${url}>`;
//import * from "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css";

export function* view(geojson, size) {
    // width
    const width = size ?? 500;
    const height = width / 1;
    // colors
    const cols = ["#c22419", "#00662e", "#b80059", "#0e0087"];
    const color = cols[Math.floor(Math.random() * cols.length)];
  
    // fields
    let result = [];
    const attr = geojson.features.map((d) => d.properties);
    attr.forEach((d) => result.push(Object.keys(d).length));
    const keys = Object.keys(attr[result.indexOf(Math.max(...result))]);
  
    // map
    let container = document.createElement("div");
    container.setAttribute("style", `width:${width}px;height:${height}px`);

    yield container;
  
    let map = L.map(container);
    let osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: ""
      }
    ).addTo(map);
  
    let mylayer = L.geoJson(geojson, { weight: 2, color: color })
      .bindPopup(
        function (Layer) {
          let r = "<table>";
          keys.forEach(
            (d) =>
              (r =
                r +
                "<tr><td><b>" +
                d +
                "</b></td><td>" +
                Layer.feature.properties[d] +
                "</td></tr>")
          );
          return r + "</table>";
        },
        {
          maxWidth: width / 1.5
        }
      )
      .addTo(map);
  
    map.fitBounds(mylayer.getBounds());
  }