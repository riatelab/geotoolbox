

## `geotoolbox`

![npm](https://img.shields.io/npm/v/geotoolbox) ![jsdeliver](https://img.shields.io/jsdelivr/npm/hw/geotoolbox) ![license](https://img.shields.io/badge/license-MIT-success) ![code size](https://img.shields.io/github/languages/code-size/riatelab/geotoolbox)

**`geotoolbox`** is a javascript tool for geographers. It allows one to manage GeoJSON properties (attribute data) and provides several useful GIS operations for thematic cartography.

![logo](img/geotoolbox.svg)


### <ins>Installation</ins>

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

### <ins>Documentation</ins>

#### ➡️ Get information

- [**`info()`**](global.html#info) - The function gives some informations about a geoJSON (size, number of nodes, type of features, etc)
- [**`isvalid()`**](global.html#isvalid) - The function check the validity of a geoJSON. It is based on [`geos-wasm`](https://chrispahm.github.io/geos-wasm/).

#### ➡️ Attribute data utilities (properties)



#### ➡️ Basemap utilities (geometries)

- [**`densify()`**](global.html#densify) - The function add nodes to a geoJSON.
- [**`dissolve()`**](global.html#dissolve) - The function allows to convert "MultiPoint", "MultiLineString" or "MultiPolygon" to single "Point", "LineString" or "Polygon".
- [**`featurecollection()`**](global.html#featurecollection) - The function allows to retrieve a FeatureCollection from a topoJSON, an array of features, a single feature, an array of geometries, a single geometry, an array of objects with coordinates (points), an array coordinates (points) or a couple of coordinates (points).
- [**`rewind()`**](global.html#rewind) - Rewind a geoJSON (Fil recipe).
- [**`rewind2()`**](global.html#rewind2) - Rewind a geoJSON (Mapbox recipe).
- [**`makevalid()`**](global.html#makevalid) - The function allows to make a GeoJSON valid using <code>geos-wasm</code> library.
- [**`removeemptygeom()`**](global.html#removeemptygeom) - The function remove all features with undefined geometries.
- [**`resolveemptygeom()`**](global.html#resolveemptygeom) - The function replace all features with undefined geometries by a valid geometry, but without coordinates
- [**`roundcoordinates()`**](global.html#roundcoordinates) - The function allows to round the coordinates of a GeoJSON. This reduces file size and speeds up display.
- [**`simplify()`**](global.html#simplify) - The function allows to simplify a geometry using <code>topojson-simplify</code> library. The parameter k difine the  The quantile of the simplification. By default, the generalization level is calculated automatically to ensure smooth map display.simplify a basemap.
- [**`stitch()`**](global.html#stitch) - The function (aka `d3.geoStitch`) returns a GeoJSON object removing antimeridian and polar cuts, and replacing straight Cartesian line segments with geodesic segments.

#### ➡️ Geoprocessing






