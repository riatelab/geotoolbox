import { isgeojson } from "./helpers/helpers.js";

export function htmltable(data, maxRows = null) {
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

  // Création du tableau
  let table = document.createElement("table");

  // Création des en-têtes du tableau
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  const headers = Object.keys(x[0]);

  headers.forEach((header) => {
    let th = document.createElement("th");
    th.textContent = header;
    th.style.backgroundColor = "white"; // Couleur d'arrière-plan de l'en-tête
    th.style.color = "#444"; // Couleur du texte
    th.style.padding = "10px"; // Espacement dans les cellules de l'en-tête
    th.style.textAlign = "left"; // Alignement du texte
    th.style.position = "sticky"; // L'en-tête reste visible lors du scroll
    th.style.top = "0"; // Reste fixé en haut
    th.style.zIndex = "1"; // Met l'en-tête au-dessus du reste
    th.style.borderBottom = "2px solid #444"; // Bordure sous l'en-tête
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Création du corps du tableau
  let tbody = document.createElement("tbody");
  const displayedData = maxRows ? x.slice(0, maxRows) : x;

  displayedData.forEach((row, index) => {
    let tr = document.createElement("tr");
    tr.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#fff"; // Couleurs alternées
    headers.forEach((header) => {
      let td = document.createElement("td");
      td.textContent = row[header];
      td.style.padding = "10px"; // Espacement dans les cellules
      td.style.borderBottom = "1px solid #ddd"; // Bordure entre les lignes
      td.style.textAlign = "left"; // Alignement à gauche du texte
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // Création du conteneur pour le tableau avec un scroll vertical
  let container = document.createElement("div");
  container.style.overflowY = "auto"; // Scroll vertical
  container.style.maxHeight = "300px"; // Hauteur max avec scroll
  container.style.margin = "0";
  container.style.padding = "0"; // Pas de padding pour éviter un espace en haut
  container.style.boxSizing = "border-box"; // Pour inclure la bordure dans la largeur
  container.style.overflowX = "hidden"; // Scroll horizontal désactivé par défaut

  container.appendChild(table);

  // Après que le tableau ait été rendu, ajuster la largeur du conteneur
  setTimeout(() => {
    const tableWidth = table.offsetWidth + 20;
    const containerWidth = container.offsetWidth;

    // Si la largeur du tableau est plus grande que celle du conteneur, on affiche un scroll horizontal
    if (tableWidth > containerWidth) {
      container.style.overflowX = "scroll"; // Afficher le scroll horizontal si nécessaire
    } else {
      container.style.width = `${tableWidth}px`; // Réduire le conteneur à la largeur du tableau
      container.style.overflowX = "hidden"; // Pas de scroll horizontal
    }
  }, 0);

  return container;
}
