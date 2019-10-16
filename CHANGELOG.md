### v4.0.4

- Fix errors related to conditional checks when `properties` is not present

### v4.0.3

- Fix variable `name` order in `util/lint-gazetteer`

### v4.0.2

- Small bug fixes [#56](https://github.com/mapbox/gazetteer/pull/56)
  - Fix bad reference to json
  - Moved @mapbox/geojsonhint to dependencies list
  - Fixed validation to properties.zoom where zero was considered falsy

### v4.0.1

- Use CommonJS modules [#55](https://github.com/mapbox/gazetteer/pull/55)

### v4.0.0

- Gazetteer specification 1.0 [#53](https://github.com/mapbox/gazetteer/pull/53) which rewrites Gazetteers to conform to the new spec
- Rewrite build steps and import patterns [#52](https://github.com/mapbox/gazetteer/pull/52)

### v3.2.0

- Add road network gazetteer [#45](https://github.com/mapbox/gazetteer/pull/45)
- Add transit gazetteer [#30](https://github.com/mapbox/gazetteer/pull/30)
- Allow Multi\* geometry types [#46](https://github.com/mapbox/gazetteer/pull/46)

### v3.1.2

- Move `@mapbox/geojsonhint` into devDependencies.

### v3.1.1

- Narrow the responsibililty of gazetteer to just linting against the spec [#42](https://github.com/mapbox/gazetteer/pull/42)

### v3.1.0

- Add highway shield gazetteer [#36](https://github.com/mapbox/gazetteer/pull/36)
- Add style benchmark locations gazetteer [#32](https://github.com/mapbox/gazetteer/pull/32)
- Add place-settlement-hierarchy-and-density gazetteer [#31](https://github.com/mapbox/gazetteer/pull/31)

### v3.0.0

- Project refactor [#19](https://github.com/mapbox/gazetteer/pull/19)
