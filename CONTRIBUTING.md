# Contributing guidelines

A single "gazetteer" in this project is a collection of places that are thematically related or relevant to a particular map styling task. Keeping the content of a gazetteer focused and clearly defined will help map designers pick suitable gazetteers for reviewing their map styling projects.

A gazetteer is a json file which conforms to the gazetteer spec.

You can contribute by either adding new places to an existing gazetteer file, or adding a new gazetteer file.

### Choosing places to add to a gazetteer

Typically, you’ll want to pick places that clearly display either:

- A single map feature (e.g. a tunnel)
- A cluster or group of map features (e.g. several tunnels, surface roads, and bridges)
- Map features that interact with each other (e.g. a tunnel under a park)

### Considerations for choosing places
  
- [ ] Is it **famous or notable**?
- [ ] Is it relatively **permanent and stable**?
- [ ] Is it one of the following?
    1. An **archetypal** example of a map feature or map feature interaction?
    2. An **extreme** example of a map feature or map feature interaction (in size, density, etc)?
    3. An **unusual** example of a map feature or map feature interaction (in shape, location relative to other features, etc)?
- [ ] Do you have reliable [**ground truth**](https://en.wikipedia.org/wiki/Ground_truth) information?

## Mapbox Streets gazetteers

Gazetteers designed for reviewing styles using Mapbox Streets data can go in the `/mapbox-streets` directory.

### Suggestions for places’ properties values
Refer to the [gazetteer spec](./spec.md) for properties available to each place entry.

#### place_name
Choose a name that is as specific as possible to the map feature(s) displayed. For context, it is often helpful to also include the place or geographic feature that encompasses the specific map feature, e.g. “Jane Byrne Interchange, Chicago", “Central Park, New York City”, or "New York City, United States".

#### zoom
Use integer zoom levels.

#### description
Explain why this particular place is significant in the context of this gazetteer.

#### highlights
A "highlight" is a json object that describes a map feature within the place by defining the map feature's data values.

Mapbox Streets gazetteers should as much as possible include highlights in each entry.

Only include highights entries for map features that are relevant to the reason why a place was chosen. For each relevant map feature, only include relevant "data_layer_fields".

If a place includes multiple relevant map features, add a separate highlight for each if they have any different data layer field values that are relevant, even if they are from the same data layer. E.g., if a place has two motorways – one bridge and one tunnel – you may want to include two separate highlights: 

```json
"highlights": [
  {
    "data_layer": "road",
    "data_layer_fields": {
      "class": "motorway",
      "structure": "tunnel"
    }
  },
  {
    "data_layer": "road",
    "data_layer_fields": {
      "class": "motorway",
      "structure": "bridge"
    }
  }
]
```

Whereas if a place has two motorways that are both tunnels, you can represent both with a single highlight:

```json
"highlights": [
  {
    "data_layer": "road",
    "data_layer_fields": {
      "class": "motorway",
      "structure": "tunnel"
    }
  }
]
```

#### tags
Optionally include arbitrary key/value tags to capture useful distinctions between places that are not already represented in the data-specific information.
