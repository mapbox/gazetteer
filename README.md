## Gazetteer

[![build status](https://secure.travis-ci.org/mapbox/gazetteer.png)](http://travis-ci.org/mapbox/gazetteer)

An index of places for maps, organized into a collection of machine-readable files that conforms to a [Gazetteer 1.0 spec](./gazetteer-spec/1.0/README.md).

### Usage

This package includes:

- A collection of Gazetteers
- A validation utility for verifying a JSON object conforms to the [Gazetteer 1.0 specification](./gazetteer-spec/1.0/README.md).

```js
import { worldwide, util } from '@mapbox/gazetteer';

const { roadNetwork, settlements } = worldwide;

util.lintGazetteer(roadNetwork); // Returns an array of error messages if invalid
```

### Releasing

1. Run `npm version {major|minor|patch}`
1. Add an entry to the [`CHANGELOG`](./CHANGELOG.md) outlining the changes.
1. Create a pull request with the changes above.
