# Contributing guidelines

A single "gazetteer" in this project is a collection of places that are thematically related or relevant to a particular map styling task. Keeping the content of a gazetteer focused and clearly defined will help map designers pick suitable gazetteers for reviewing their map styling projects.

A gazetteer is a json file which conforms to the [gazetteer spec](https://github.com/mapbox/gazetteer/tree/main/gazetteer-spec).

You can contribute by either adding new places to an existing gazetteer file, or adding a new gazetteer file.

### Choosing places to add to a gazetteer

Typically, you’ll want to pick places that clearly display either:

- A single map feature (e.g. a tunnel)
- A cluster or group of map features (e.g. several tunnels, surface roads, and bridges)
- Map features that interact with each other (e.g. a tunnel under a park)

### Considerations for choosing places

- Is it **famous or notable**?
- Is it relatively **permanent and stable**?
- Is it one of the following?
  1. An **archetypal** example of a map feature or map feature interaction?
  2. An **extreme** example of a map feature or map feature interaction (in size, density, etc)?
  3. An **unusual** example of a map feature or map feature interaction (in shape, location relative to other features, etc)?
- Do you have reliable [**ground truth**](https://en.wikipedia.org/wiki/Ground_truth) information?

### Suggestions for property values

Refer to the [gazetteer spec](https://github.com/mapbox/gazetteer/tree/main/gazetteer-spec) for properties available to each place entry.

#### place_name

Choose a name that is as specific as possible to the map feature(s) displayed. For context, it is often helpful to also include the place or geographic feature that encompasses the specific map feature, e.g. “Jane Byrne Interchange, Chicago", “Central Park, New York City”, or "New York City, United States".

#### zoom

Prefer integer zoom levels between 0-22

#### bearing

Optional value between -179-180.

#### pitch

Optional value between 0-60.

#### place_description

Optional value. Explain why this particular place is significant in the context of this gazetteer.

#### tags

Optional value. Include arbitrary value tags to capture useful distinctions between places that are not already represented in the data-specific information.

## Releasing a new version

Releases are published to npm via GitHub Actions.

### Steps

1. **Bump the version** in `package.json` (follow [semver](https://semver.org))
2. **Update `CHANGELOG.md`** with a summary of what changed
3. **Open a PR**, get it reviewed and merged to `main`
4. **Trigger the release** from the [Actions tab](../../actions/workflows/npm-release.yml):
   - Select **NPM release** → **Run workflow** → run from `main`

The workflow will publish to npm and create a GitHub release with auto-generated notes.

> **Note:** Only Mapbox maintainers with write access to this repository can trigger the release workflow. External contributors can open and contribute to PRs, but releases are always cut by the owning team.
