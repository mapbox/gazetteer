const fs = require('fs');
const assert = require('assert');
const geojsonhint = require('@mapbox/geojsonhint');
const gazetteers = fs.readdirSync('./mapbox-streets');

// Validate all features.
gazetteers.forEach(gazetteer => {
  const filePath = `./mapbox-streets/${gazetteer}`
  const gazetteerData = JSON.parse(fs.readFileSync(filePath))
  assert.ifError(validate(gazetteerData));
})

function validate(data) {
  const geojsonErrors = geojsonhint.hint(data);
  if (geojsonErrors.length > 0) {
    return new Error(geojsonErrors[0].message);
  }

  const gazetteerName = data.name;
  if (typeof gazetteerName !== 'string') {
    return new Error('gazetteer must have a name property of type string')
  }

  for (let featureIndex = 0; featureIndex < data.features.length; featureIndex++) {
    const feature = data.features[featureIndex];
    const center = feature.geometry.coordinates;
    const placeName = feature.properties.place_name;

    if (feature.geometry.type !== 'Point') {
      return new Error(`${gazetteerName} "${placeName}": must be type: Point`);
    }

    if (typeof center[0] !== 'number' || center[0] < -180 || center[0] > 180) {
      return new Error(`${gazetteerName} "${placeName}": lng value must be between -180 and 180`);
    }

    if (typeof center[1] !== 'number' || center[1] < -90 || center[1] > 90) {
      return new Error(`${gazetteerName} "${placeName}": lat value must be between -90 and 90`);
    }

    for (let key in feature.properties) {
      const value = feature.properties[key];

      switch (key) {
        case 'place_name':
          if (typeof value !== 'string' || value.length > 255) {
            return new Error(`${gazetteerName} "${placeName}": place_name must be a string of 255 characters or less`);
          }
          break;

        case 'zoom':
          if (typeof value !== 'number' || value < 0 || value > 22) {
            return new Error(`${gazetteerName} "${placeName}": zoom must be a number between 0 and 22`);
          }
          break;

        case 'string':
          if (typeof value !== 'string') {
            return new Error(`${gazetteerName} "${placeName}": description must be an string`);
          }
          break;

        case 'tags':
          if (typeof value !== 'object') {
            return new Error(`${gazetteerName} "${placeName}": tags must be an object`);
          }
          break;

        case 'highlights':
          if (!Array.isArray(value)) {
            return new Error(`${gazetteerName} "${placeName}": highlights must be an array`);
          }

          for (let highlightIndex = 0; highlightIndex < value.length; highlightIndex++) {
            const highlight = value[highlightIndex]
            const geometryType = highlight.geometry_type;
            const dataLayer = highlight.data_layer;

            if (geometryType && /^(?!Point$|LineString$|Polygon$).*/.test(geometryType)) {
              return new Error(`${gazetteerName} "${placeName}": highlight ${highlightIndex} must be one of Point, LineString, or Polygon`);
            }

            if (typeof dataLayer !== 'string' || dataLayer.length > 30) {
              return new Error(`${gazetteerName} "${placeName}": highlight ${highlightIndex} data_layer must be a string of 30 characters or less`);
            }

            if (typeof highlight.data_layer_fields !== 'object') {
              return new Error(`${gazetteerName} "${placeName}": highlight ${highlightIndex} data_layer_fields must be an object`);
            }
          };
          break;
      }

      const required = ['place_name', 'zoom'];
      for (let propertyIndex = 0; propertyIndex < required.length; propertyIndex++) {
        const property = required[propertyIndex];
        if (!(property in feature.properties)) {
          return new Error(`${gazetteerName} "${placeName}": ${property} is required`);
        }
      }
    };
  }
};
