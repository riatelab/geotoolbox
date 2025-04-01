import { isgeojson } from "./helpers/helpers.js";

/**
 * @function htmltable
 * @summary  View a data table.
 * @param {object} data - a GeoJSON FeatureCollection
 * @param {object} options - Optional parameters
 * @param {number} [options.maxrows] - Number max of lines
 * @example
 * geottolbox.htmltable(*a geojson*)
 */

export function htmltable(data, { maxrows = null } = {}) {
  let x;
  if (isgeojson(data)) {
    x = data.features.map((d) => {
      return Object.assign(
        {
          ["GEOMETRY"]:
            d?.geometry?.type +
            " (" +
            d.geometry.coordinates.flat(10).length / 2 +
            " pts)",
        },
        d.properties
      );
    });
  } else {
    x = data;
  }

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  const headers = Object.keys(x[0]);

  headers.forEach((header, index) => {
    let th = document.createElement("th");
    th.textContent = header;
    th.style.cursor = "pointer";
    th.style.backgroundColor = "white";
    th.style.color = "#444";
    th.style.padding = "10px";
    th.style.textAlign = "left";
    th.style.position = "sticky";
    th.style.top = "0";
    th.style.zIndex = "1";
    th.style.borderBottom = "2px solid #444";

    let asc = true;
    th.addEventListener("click", () => {
      asc = !asc;
      sortTable(index, asc);
    });

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  let tbody = document.createElement("tbody");
  const displayedData = maxrows ? x.slice(0, maxrows) : x;

  function renderTable(data) {
    tbody.innerHTML = "";
    data.forEach((row, index) => {
      let tr = document.createElement("tr");
      tr.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#fff";
      headers.forEach((header) => {
        let td = document.createElement("td");
        td.textContent = row[header];
        td.style.padding = "10px";
        td.style.borderBottom = "1px solid #ddd";
        td.style.textAlign = "left";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function sortTable(columnIndex, ascending) {
    displayedData.sort((a, b) => {
      let valA = a[headers[columnIndex]];
      let valB = b[headers[columnIndex]];
      if (!isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB))) {
        return ascending ? valA - valB : valB - valA;
      }
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    renderTable(displayedData);
  }

  renderTable(displayedData);
  table.appendChild(tbody);

  let container = document.createElement("div");
  container.style.overflowY = "auto";
  container.style.maxHeight = "300px";
  container.style.margin = "0";
  container.style.padding = "0";
  container.style.boxSizing = "border-box";
  container.style.overflowX = "hidden";

  container.appendChild(table);
  setTimeout(() => {
    const tableWidth = table.offsetWidth + 20;
    const containerWidth = container.offsetWidth;
    if (tableWidth > containerWidth) {
      container.style.overflowX = "scroll";
    } else {
      container.style.width = `${tableWidth}px`;
      container.style.overflowX = "hidden";
    }
  }, 0);

  return container;
}
