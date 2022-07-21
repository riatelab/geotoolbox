![logo](img/geotoolbox.svg)]

![npm](https://img.shields.io/npm/v/geotoolbox)
![jsdeliver](https://img.shields.io/jsdelivr/npm/hw/geotoolbox)
![license](https://img.shields.io/badge/license-MIT-success)
![code size](https://img.shields.io/github/languages/code-size/neocarto/bertin)

*geotoolbox* is javascript tool for geographers. It allows to simply deal with geojson properties (attribute data) and provides several GIS operations useful for thematic cartography.

## 1. <ins>Installation</ins>

#### 1.1. In browser

Latest version

```html
<script src="https://cdn.jsdelivr.net/npm/geotoolbox" charset="utf-8"></script>
```

Pinned version

```html
<script
  src="https://cdn.jsdelivr.net/npm/geotoolbox@1.2"
  charset="utf-8"
></script>
```

#### 1.2. In [Observable](https://observablehq.com/)

Latest version

```js
geo = require("geotoolbox");
```

Pinned version

```js
geo = require("geotoolbox@1.2");
```

### 2. <ins>Demo</ins>

Find a demo of all functions [here](https://observablehq.com/d/17367d9479d6156f).

### 3. <ins>Documentation</ins>

#### 3.1. Handle properties

_Here we are talking about some easy functions useful to handle attribute data._

**add** allows to add a new field in the attribute table. This function return a new object and do not modify the initial object.

```js
geo.add({
    x: world, // a geojson
    field: "gdppc", // new colname (string) 
    expression: "gdp/pop*1000" // a string containing an expression
})
```

**filter** allows to filter a geojson from its attribute table.This function return a new object and do not modify the initial object.

```js
geo.filter({
    x: world, // a geojson
    expression: "pop2022 >= 100000" // an expression (string) 
})
```

**head** allows to get the n top values from a given field.This function return a new object and do not modify the initial object.

```js
geo.head({
    x: world, // a geojson
    field: "gdp", // a colname (string)
    nb: 5 // default:10. Number of features to get. Here, the 5 richest countries.
})
```

**keep** allows to select one or several columns to keep in the attribute table. All other columns are deleted. This function return a new object and do not modify the initial object.

```js
geo.keep({
    x: world, // a geojson
    field: ["ISO3", "pop2020"] // colname(s) (string or array of strings) 
})
```

**remove** allow to remove one or several columns in the attribute table. This function return a new object and do not modify the initial object.

```js
geo.remove({
    x: world, // a geojson
    field: ["tmp", "FID"] // colname(s) (string or array of strings) 
})
```

**subset** allows to create a subset from an array of values. This function return a new object and do not modify the initial object.

```js
geo.subset({
    x: world, // a geojson
    field: "ISO3", // colname (string)
    selection: ["USA", "CAN", "MEX"], // values to be kept. Here, North american countries
    inverse: false // default: false. If true, all countries except USA, CAN and MEX are kept 
})
```

**table** allows to get a geojson attribute table.

```js
geo.table(world // a geojson)
```

**tail** allows to get the n bottom values from a given field.This function return a new object and do not modify the initial object.

```js
geo.tail({
    x: world, // a geojson
    field: "gdp", // a colname (string)
    nb: 5 // default:10. Number of features to get. Here, the 5 least wealthy countries
})
```

#### 3.2 Handle geometries

_Here we are talking about some easy functions useful for thematic maps, based on [topojson](https://github.com/topojson/topojson) and [turf](https://github.com/Turfjs/turf)._

**bbox** allows to return a [geographic bounding box](https://www.jasondavies.com/maps/bounds/) in geojson from a geojson or a n array defining a bounding `[[left, bottom], [right, top]]`. This function is basend on Jacob Rus [code](https://observablehq.com/@jrus/sphere-resample).

```js
geo.bbox(world) // a geojson
```

**border** allows to extract boundaries from a geojson (polygons). With options, you can get ids and calculate discontinuities

```js
geo.bbox(world) // a geojson
```

With options:

```js
geo.border(
    world, // a geojson
    { 
        id: "ISO3", // ids
        values: "pop", // values
        type: "abs", // type of discontinuities calculated: rel (relative), abs(absolute) (default:"rel")
        share: 0.8 // share of kept borders (default: null for all)
    })
```

**centroid** allows to compute centroids from polygons

```js
geo.centroid(world) // a geojson (polygons)
```

By default, the centroid is placed in the largest polygon. But yout can avoid it

```js
geo.centroid(
    world, // a geojson
    {
        largest: false // largest polygon. true/false (default: true)
    })
```

**coords2geo** allows to build a geojson from a table with lat,lng coordinates.

```js
geo.coords2geo(
    data, // a json
    {
        lat: "lat" // the field containig latitude coordinates (you can use also `latitude`) 
        lng: "lon" // the field containig longitude coordinates (you can use also `longitude`) 
    })
```

This function works also if coordinates are stored in a single field.

```js
geo.coords2geo(
    data, // a json
    {
        coords: "Coordinates" // the field containig coordinates (you can use also `coordinates`) 
    })
```

For an even simpler automatic use, you don't have to specify the name of the variables containing the coordinates. If your data table contains the following fields (`lat`, `latitude`, `lon`,`lng`, `longitude`, `coords`, `coordinates`, `coordinate`), they are automatically selected. It is convenient, but for a better control and a faster calculation, it is still better to define yourself where the coordinates are.

```js
geo.coords2geo(data) // a json
```

Sometimes there can be an unfortunate inversion of the coordinates. In this case you can simply set the reverse option to true. 

```js
geo.coords2geo(
    data, // a json
    {
        reverse: true // to reverse latitudes and longitude coordinates
    })
```



**dissolve** allows to disolve geometries (multi parts to single parts)

```js
geo.dissolve(world) // a geojson
```

**union** allows to merge geometries

```js
geo.union(world) // a geojson
```

With options, you can compute an union by id.

```js
continents = geo.union(
    world, // a geojson
    { 
        id: "continent" // ids
    })
```

**simplify** allows to simplify geometries preserving topology (`topojson.simplify` algorithm)

```js
geo.simplify(
    world, // a geojson
    { 
        k, // factor of simplification (default: 0.5)
        merge: false // true to merge geometries(default: false)
    })
```