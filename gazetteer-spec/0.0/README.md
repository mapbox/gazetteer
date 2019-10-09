# Gazetteer 0.0

A gazetteer is a [GeoJSON](https://tools.ietf.org/html/rfc7946) FeatureCollection object. Each entry (aka "place") is represented by a Feature object.

```javascript
{
  "type": "FeatureCollection",
  "name": string,
  "data-source": string (optional),
  "features": [
    {
      "type": "Feature",
      "geometry": {
      "type": "Point",
      "coordinates": [number, number] // [lon/lat]
      },
      "properties": {
        "place_name": string,
        "zoom": number, // 0-22
        "description": string (optional),
        "tags": {
          value: value,
          ...
        }: object (optional),
        "highlights": [
          {
            "geometry_type": string (optional), // One of: Point, LineString, Polygon
            "data_layer": string, // A Mapbox Street Source v8 data layer name
            "data_layer_fields": {
              value: value, // field/value pair from a Mapbox Streets Source v8 data layer
              ...
            }: object (optional)
          }: object,
          ...
        ]: array (optional)
      }
    }
  ]
}
```

## Example

```javascript
{
  "type": "FeatureCollection",
  "name": "Large Urban Parks",
  "data-source": "mapbox.mapbox-streets-v8",
  "features": [
    {
      "type": "Feature",
      "geometry": {
      "type": "Point",
      "coordinates": [-73.96067, 40.78166]
      },
      "properties": {
        "place_name": "Central Park, New York City",
        "zoom": 13,
        "description": "Famous urban park containing many attractions",
        "tags": {
          "area_km2": "3.41",
          "squirrel_population": "unknown"
        },
        "highlights": [
          {
            "data_layer": "poi_label",
            "geometry_type": "Point",
            "data_layer_fields": {
              "class": "park-like",
              "maki": "park"
            }
          }
        ]
      }
    }
  ]
}
```
