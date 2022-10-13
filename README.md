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
  src="https://cdn.jsdelivr.net/npm/geotoolbox@1.8.6"
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
geo = require("geotoolbox@1.8.6");
```

### 2. <ins>Demo</ins>

Find a demo of all functions [here](https://observablehq.com/@neocartocnrs/hello-geotoolbox?collection=@neocartocnrs/geotoolbox).

### 3. <ins>Documentation</ins>

#### 3.1. Handle properties

_Here we are talking about some easy functions useful to handle attribute data. [Example](https://observablehq.com/@neocartocnrs/handle-properties?collection=@neocartocnrs/geotoolbox)_

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

_Here we are talking about some easy functions useful for thematic maps, based on [topojson](https://github.com/topojson/topojson), [d3geo](https://github.com/d3/d3-geo) and [jsts](https://github.com/bjornharrtell/jsts)._

**aggregate** allows to merge geometries based on their topology. To merge polygon geometries, see ```union```. [Example](https://observablehq.com/@neocartocnrs/aggregate?collection=@neocartocnrs/geotoolbox)

![aggregate](img/aggregate.svg)

```js
geo.aggregate(world) // a geojson
```

With options, you can compute an aggregate by id.

```js
continents = geo.aggregate(
    world, // a geojson
    { 
        id: "continent" // ids
    })
```

**bbox** allows to return a [geographic bounding box](https://www.jasondavies.com/maps/bounds/) in geojson from a geojson or a n array defining a bounding `[[left, bottom], [right, top]]`. This function is basend on Jacob Rus [code](https://observablehq.com/@jrus/sphere-resample). [Example](https://observablehq.com/@neocartocnrs/bbox?collection=@neocartocnrs/geotoolbox)

![bbox](img/bbox.svg)

```js
geo.bbox(world) // a geojson
```

**border** allows to extract boundaries from a geojson (polygons). With options, you can get ids and calculate discontinuities. [Example](https://observablehq.com/@neocartocnrs/border?collection=@neocartocnrs/geotoolbox)

![border](img/border.svg)

```js
geo.border(world) // a geojson
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

**buffer**  allows to build a buffer from points, lines or polygones. The distance is in kilimeters.

![buffer](img/buffer.svg)

```js
geo.buffer(geojson, { dist: 1000 }) // 1000 km 
```

The ```distance``` value can also be contained in a geojson field (in the properties). In this case, you just have to indicate the name of this field.

```js
geo.buffer(geojson, { dist: "a field" }) // a filed in properties
```

The merge option allows to merging all the output buffers.

```js
geo.buffer(geojson, { dist: 1000, merge:true }) 
```

The ```clip``` option prevents the buffers from sticking out of the world outline. Not having coordinates that exceed [-90, 90] in latitude and [-180, 180] in longitude is necessary for the d3.js projection functions to work properly.

```js
geo.buffer(geojson, { dist: 1000, clip:true }) 
```

The ```step``` option allows to define the precision of the buffer (default:8)

```js
geo.buffer(geojson, { dist: 1000, step:1 }) 
```

You can use ```wgs84=false``` if your gejson is not in wgs84. In this case, the distance will be given in the map coordinates. 

```js
geo.buffer(geojson, { dist: 1000, wgs84:false }) 
```

**clip** allows to clip geometries. [Example](https://observablehq.com/@neocartocnrs/clip?collection=@neocartocnrs/geotoolbox)

![clip](img/clip.svg)

```js
geo.clip(geojson1, {clip:geojson2}) 
```

With the option reverse:true, you can make a difference operation.

![clip](img/clip_reverse.svg)

```js
geo.clip(geojson1, {clip:geojson2, reverse: true}) 
```

You can also define a buffer in km around the clip.

```js
geo.clip(geojson1, {clip:geojson2, buffer: 100}) 
```

**centroid** allows to compute centroids from polygons. [Example](https://observablehq.com/@neocartocnrs/centroid?collection=@neocartocnrs/geotoolbox)

![centroid](img/centroid.svg)

```js
geo.centroid(world) // a geojson (polygons)
```

By default, the centroid is placed in the largest polygon. But yout can avoid it.

```js
geo.centroid(
    world, // a geojson
    {
        largest: false // largest polygon. true/false (default: true)
    })
```

Moreover, it may happen that the coordinates of your base map are not in latitudes and longitudes, but already projected. In this case you can use the option `planar = true`.

```js
geo.centroid(
    world, // a geojson
    {
        largest: false, // largest polygon. true/false (default: true)
        planar: true // if geometries are already projected
    })
```

**coords2geo** allows to build a geojson from a table with lat,lng coordinates. [Example](https://observablehq.com/@neocartocnrs/coords2geo?collection=@neocartocnrs/geotoolbox)

![coords2geo](img/coords2geo.svg)

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

**dissolve** allows to disolve geometries (multi parts to single parts). [Example](https://observablehq.com/@neocartocnrs/dissolve?collection=@neocartocnrs/geotoolbox)

![dissolve](img/dissolve.svg)

```js
geo.dissolve(world) // a geojson
```

**union** allows to merge polygon geometries. [Example](https://observablehq.com/@neocartocnrs/union?collection=@neocartocnrs/geotoolbox)

![union](img/union.svg)

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

**simplify** allows to simplify geometries preserving topology (`topojson.simplify` algorithm). [Example](https://observablehq.com/@neocartocnrs/simplify?collection=@neocartocnrs/geotoolbox)

![simplify](img/simplify.svg)

```js
geo.simplify(
    world, // a geojson
    { 
        k, // factor of simplification (default: 0.5)
        merge: false // true to merge geometries(default: false)
    })
```

**tissot** tissot allows to get the Tissot's indicatrix. [Example](https://observablehq.com/@neocartocnrs/tissot?collection=@neocartocnrs/geotoolbox)

![tissot](img/tissot.svg)

```js
geo.tissot(20) // step (default; 10)
```

**geolines** allows to get the natural geographic lines such as equator, tropics & polar circles. [Example](https://observablehq.com/@neocartocnrs/geolines?collection=@neocartocnrs/geotoolbox)

![geolines](img/geolines.svg)

```js
geo.geolines() 
```

#### 3.3 Helpers

**featurecollection** allows to convert an array of features or an array of geometries to a well formated geosjon. [Example](https://observablehq.com/@neocartocnrs/featurecollection?collection=@neocartocnrs/geotoolbox)

![featurecollection](img/featurecollection.svg)

```js
geo.featurecollection(features) 
```
