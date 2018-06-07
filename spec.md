# Gazetteer specification

A gazetteer is a [GeoJSON](https://tools.ietf.org/html/rfc7946) FeatureCollection object. Each entry (aka "place") is represented by a Feature object:

```
{
	"type": "FeatureCollection",
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
	      "description": string, // Optional
	      "tags": { // Optional
	        string: string,
	        string: string,
	        ...
	      },
	      "highlights": [ // Optional array of relevant map features displayed in this place
	        {
	          "data_layer": string, // A Mapbox Street Source v8 data layer name
	          "geometry_type": string, // Optional. One of: Point, LineString, Polygon
	          "data_layer_fields": { // Optional
	            string: string, // field:value pair from a Mapbox Streets Source v8 data layer
	            string: string
	          }
	        },
          {
            "data_layer": ...
            }
          }
	      ]
	    }
	  }
	]
}
```


## Example

```json
{
	"type": "FeatureCollection",
	"features": [	
		{
			"type": "Feature",
			"geometry": {
			"type": "Point",
	      "description": "Popular tourist site",
			"coordinates": [-73.96067, 40.78166]
	    },
	    "properties": {
	      "place_name": "Central Park, New York City",
	      "zoom": 13,
	      "description": "Large urban park containing many attractions",
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