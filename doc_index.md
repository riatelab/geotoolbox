## `geotoolbox@3` (not published yet)

# WORK IN PROGRESS....

![npm](https://img.shields.io/npm/v/geotoolbox) ![jsdeliver](https://img.shields.io/jsdelivr/npm/hw/geotoolbox) ![license](https://img.shields.io/badge/license-MIT-success) ![code size](https://img.shields.io/github/languages/code-size/riatelab/geotoolbox)

**`geotoolbox`** is a javascript tool for geographers. It allows one to manage GeoJSON properties (attribute data) and provides several useful GIS operations for thematic cartography. The aim of geotoolbox is to offer functions designed to handle geoJSON directly, not just single features or geometries. As a result, the library is particularly user-friendly for users with little experience of javascript development. From a technical point of view, geotoolbox is largely based on geos-wasm GIS operators, but also on d3.geo and topojson. Geotoolbox also works well with other cartographic libraries such as geoviz and bertin.js. Note that there are other GIS libraries like turf.js, which is really great. 

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

#### ➡️ Information

*Some functions to describe the content of geoJSONs.*

- [**`info()`**](global.html#info) - The function gives some informations about a geoJSON (size, number of nodes, type of features, etc)
- [**`isvalid()`**](global.html#isvalid) - The function check the validity of a geoJSON. It is based on [`geos-wasm`](https://chrispahm.github.io/geos-wasm/).

#### ➡️ Data handling

*Some functions for handling data. These functions can be applied to a geoJSON (in this case, properties are considered) or a simple data table (array of objects).*

- [**`addproperty()`**](global.html#addproperty) - The function add a field to a dataset.
- [**`autotype()`**](global.html#autotype) - The function detects common data types such as numbers, dates and booleans, and convert properties values to the corresponding JavaScript type.
- [**`columns`**](global.html#columns) - Select, rename and reorder properties.
- [**`combine`**](global.html#combine) - Puts several datsets into one.
- [**`head()`**](global.html#head) - The function returns the n first elements.
- [**`filter()`**](global.html#filter) - Filter a dataset.
- [**`replace()`**](global.html#replace) - Replace substrings in a dataset.
- [**`sort()`**](global.html#sort) - Sort a dataset according to a field.
- [**`tail()`**](global.html#tail) - The function returns the n last elements.

#### ➡️ Basemap utilities

*Useful functions for cartography.*

- [**`densify()`**](global.html#densify) - The function add nodes to a geoJSON.
- [**`dissolve()`**](global.html#dissolve) - The function allows to convert "MultiPoint", "MultiLineString" or "MultiPolygon" to single "Point", "LineString" or "Polygon".
- [**`featurecollection()`**](global.html#featurecollection) - The function allows to retrieve a FeatureCollection from a topoJSON, an array of features, a single feature, an array of geometries, a single geometry, an array of objects with coordinates (points), an array coordinates (points) or a couple of coordinates (points).
- [**`geolines()`**](global.html#geolines) - Equator, tropics & polar circles.
- [**`rewind()`**](global.html#rewind) - Rewind a geoJSON (Fil recipe).
- [**`rewind2()`**](global.html#rewind2) - Rewind a geoJSON (Mapbox recipe).
- [**`makevalid()`**](global.html#makevalid) - The function allows to make a GeoJSON valid using <code>geos-wasm</code> library.
- [**`removeemptygeom()`**](global.html#removeemptygeom) - The function remove all features with undefined geometries.
- [**`resolveemptygeom()`**](global.html#resolveemptygeom) - The function replace all features with undefined geometries by a valid geometry, but without coordinates
- [**`roundcoordinates()`**](global.html#roundcoordinates) - The function allows to round the coordinates of a GeoJSON. This reduces file size and speeds up display.
- [**`simplify()`**](global.html#simplify) - The function allows to simplify a geometry using <code>topojson-simplify</code> library. The parameter k difine the  The quantile of the simplification. By default, the generalization level is calculated automatically to ensure smooth map display.simplify a basemap.
- [**`stitch()`**](global.html#stitch) - The function (aka `d3.geoStitch`) returns a GeoJSON object removing antimeridian and polar cuts, and replacing straight Cartesian line segments with geodesic segments.
- [**`tissot()`**](global.html#tissot) - Generate Tissot's indicatrix.

#### ➡️ Geoprocessing

*Main GIS functions.*

- [**`aggregate()`**](global.html#aggregate) - Aggregate geometries.
- [**`bbox()`**](global.html#bbox) - Geographic bounding box.
- [**`centroid()`**](global.html#centroid) - Centroids of polygons or multipolygons.
- [**`nodes()`**](global.html#nodes) - Retrieve geometry nodes.


#### ➡️ Operators

*GIS operators. All these functions return a true or false boolean.*

- [**`op.contains()`**](global.html#op/contains) - Tests if geometry g2 is completely within g1, but not wholly contained in the boundary of g1.
- [**`op.covers()`**](global.html#op/covers) - Tests if geometry g1 covers g2, which is the case if every point of g2 lies in g1.
- [**`op.crosses()`**](global.html#op/crosses) - Tests if two geometries interiors intersect but their boundaries do not. Most useful for finding line crosses cases.
- [**`op.disjoint()`**](global.html#op/disjoint) - Tests if two geometries have no point in common.
- [**`op.coveredby()`**](global.html#op/coveredby) - Tests if geometry g1 is covered by g2, which is the case if every point of g1 lies in g2.
- [**`op.equals()`**](global.html#op/equals) - Tests if two geometries contain the same set of points in the plane.
- [**`op.intersects()`**](global.html#op/intersects) - Tests if two geometries intersect.
- [**`op.overlaps()`**](global.html#op/overlaps) - Tests if two geometries share interiors but are neither within nor contained.
- [**`op.touches()`**](global.html#op/touches) - Tests if two geometries share boundaries at one or more points, but do not have interior points in common.
- [**`op.within()`**](global.html#op/within) - Tests if geometry g1 is completely within g2, but not wholly contained in the boundary of g2.

<hr/>

### TODO

- dataformat: a main function for data handling
- join: to join two datasets with an id 
- map: in data handling