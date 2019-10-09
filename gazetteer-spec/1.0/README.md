# Gazetteer 1.0

The key words, "MUST", "SHOULD", "MAY" in this document are to be
interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## Abstract

A gazetteer is a [GeoJSON](https://tools.ietf.org/html/rfc7946)
FeatureCollection object. Each entry, (aka "place") is represented by a
Feature object.

## Schema

In addition to conforming to valid GeoJSON, the rules on these members are as
follows:

#### `FeatureCollection` object

- MUST contain a `name` (string) member.

#### `Geometry` object

- `type` member MUST be a value of `Point`.

#### `Properties` object

- MUST contain a `zoom` (number) member between 0 & 22.
- MUST contain a `place_name` (string) member.
- SHOULD contain a `place_description` (string) member.
- MAY contain a `tags` member, whose value is an array of strings.

## Example

```json
{
  "type": "FeatureCollection",
  "name": "Large Urban Parks",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.96067, 40.78166]
      },
      "properties": {
        "place_name": "Central Park, New York City",
        "place_description": "Famous urban park containing many attractions",
        "zoom": 13,
        "tags": ["landform-park", "landuse"]
      }
    }
  ]
}
```
