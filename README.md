# geotoolbox

A js tool to add, remove, change and filter fields within a geojson

## 1. Installation

#### In browser

Latest version

```html
<script src="https://cdn.jsdelivr.net/npm/geotoolbox" charset="utf-8"></script>
```

Pinned version

```html
<script
  src="https://cdn.jsdelivr.net/npm/geotoolbox@1.0"
  charset="utf-8"
></script>
```

#### In [Observable](https://observablehq.com/)

Latest version

```js
geo = require("geotoolbox");
```

Pinned version

```js
geo = require("geotoolbox@1.0");
```

### 2. Documentation

**add()** allow to add a new field in the attribute table. This function return a new object and do not modify the initial object.

```js
geo.add({
    x: world, // a geojson
    field: "gdppc", // new colname (string) 
    expression: "gdp/pop*1000" // a string containing an expression
})
```
**filter()** allow to filter a geojson from its attribute table.This function return a new object and do not modify the initial object.

```js
geo.filter({
    x: world, // a geojson
    expression: "pop2022 >= 100000" // an expression (string) 
})
```

**keep()** allow to select one or several columns to keep in the attribute table. All other columns are deleted. This function return a new object and do not modify the initial object.

```js
geo.keep({
    x: world, // a geojson
    field: ["ISO3", "pop2020"] // colname(s) (string or array of strings) 
})
```

**remove()** allow to remove one or several columns in the attribute table. This function return a new object and do not modify the initial object.

```js
geo.remove({
    x: world, // a geojson
    field: ["tmp", "FID"] // colname(s) (string or array of strings) 
})
```

**table()** allow to get a geojson attribute table.

```js
geo.table(world // a geojson)
```

