![npm](https://img.shields.io/npm/v/geotoolbox) ![jsdeliver](https://img.shields.io/jsdelivr/npm/hw/geotoolbox) ![license](https://img.shields.io/badge/license-MIT-success) ![code size](https://img.shields.io/github/languages/code-size/riatelab/geotoolbox)

# `geotoolbox@3`

#### **`geotoolbox`** is a javascript tool for geographers. It allows one to manage GeoJSON properties (attribute data) and provides several useful **GIS operations** for thematic cartography. The aim of geotoolbox is to offer functions designed to handle geoJSON directly, not just single features or geometries. As a result, the library is particularly **user-friendly** for users with little experience of javascript development. From a technical point of view, geotoolbox is largely based on **geos-wasm** GIS operators (a big thanks to Christoph Pahmeyer 🙏), but also on d3.geo and topojson. Geotoolbox also works well with other cartographic libraries such as `geoviz` and `bertin.js`. Note that there are other GIS libraries like `turf.js`, which is really great. 

![logo](img/geotoolbox.svg)



### ➡️ Installation

- CDN

``` html
<script src="https://cdn.jsdelivr.net/npm/geotoolbox@3" charset="utf-8"></script>
```

- npm

```
npm install geotoolbox@3
```

- Observable notebooks

``` js
geo = require("geotoolbox@3");
```

### ➡️ Usage

Most functions take the same type of argument as input - a dataset and options - like `geotoolbox.myfunction(data, {options})`. Please note that functions based on geos-wasm are asynchronous.

- A buffer example

``` js
const mybyffer = await geotoolbox.buffer(data, {dist: 1000});
```

- Data handling example (add a field in a geoJSON)

``` js
geotoolbox.derive(data, {
  field: "gdppc", // the name of the new field
  value: "gdp/pop*1000", // a function to calculate the value
  mutate: true // to update the dataset
});
```
- Tests if two geometries intersect

``` js
geotoolbox.intersects(data1, data2);
```

### ➡️ How it works?

See documentation api: https://riatelab.github.io/geotoolbox

