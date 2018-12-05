const geojsonhint = require('@mapbox/geojsonhint');

function lint(gazetteer) {
  let errors = [];

  const geojsonErrors = geojsonhint.hint(gazetteer);
  if (geojsonErrors.length > 0) {
    geojsonErrors.forEach(error => {
      errors.push(error.message);
    });
  }

  const gazetteerName = gazetteer.name;
  if (typeof gazetteerName !== 'string') {
    errors.push('gazetteer must have a name property of type string');
  }

  for (let featureIndex = 0; featureIndex < gazetteer.features.length; featureIndex++) {
    const feature = gazetteer.features[featureIndex];
    const center = feature.geometry.coordinates;
    const placeName = feature.properties.place_name;

    if (feature.geometry.type !== 'Point') {
      errors.push(`${gazetteerName}, feature ${featureIndex}: must be type: Point`);
    }

    if (typeof center[0] !== 'number' || center[0] < -180 || center[0] > 180) {
      errors.push(`${gazetteerName}, feature ${featureIndex}: lng value must be between -180 and 180`);
    }

    if (typeof center[1] !== 'number' || center[1] < -90 || center[1] > 90) {
      errors.push(`${gazetteerName}, feature ${featureIndex}: lat value must be between -90 and 90`);
    }

    for (let key in feature.properties) {
      const value = feature.properties[key];

      switch (key) {
        case 'place_name':
          if (typeof value !== 'string' || value.length > 255) {
            errors.push(`${gazetteerName}, feature ${featureIndex}: place_name must be a string of 255 characters or less`);
          }
          break;

        case 'zoom':
          if (typeof value !== 'number' || value < 0 || value > 22) {
            errors.push(`${gazetteerName}, feature ${featureIndex}: zoom must be a number between 0 and 22`);
          }
          break;

        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${gazetteerName}, feature ${featureIndex}: description must be a string`);
          }
          break;

        case 'tags':
          if (typeof value !== 'object') {
            errors.push(`${gazetteerName}, feature ${featureIndex}: tags must be an object`);
          }
          break;

        case 'highlights':
          if (!Array.isArray(value)) {
            errors.push(`${gazetteerName}, feature ${featureIndex}: highlights must be an array`);
          }

          for (let highlightIndex = 0; highlightIndex < value.length; highlightIndex++) {
            const highlight = value[highlightIndex]
            const geometryType = highlight.geometry_type;
            const dataLayer = highlight.data_layer;

            if (geometryType && /^(?!Point$|LineString$|Polygon$).*/.test(geometryType)) {
              errors.push(`${gazetteerName}, feature ${featureIndex}, highlight ${highlightIndex}: must be one of Point, LineString, or Polygon`);
            }

            if (typeof dataLayer !== 'string' || dataLayer.length > 30) {
              errors.push(`${gazetteerName}, feature ${featureIndex}, highlight ${highlightIndex}: data_layer must be a string of 30 characters or less`);
            }

            if (highlight.data_layer_fields && typeof highlight.data_layer_fields !== 'object') {
              errors.push(`${gazetteerName}, feature ${featureIndex}, highlight ${highlightIndex}: data_layer_fields must be an object`);
            }
          };
          break;
      }

      const required = ['place_name', 'zoom'];
      for (let propertyIndex = 0; propertyIndex < required.length; propertyIndex++) {
        const property = required[propertyIndex];
        if (!(property in feature.properties)) {
          errors.push(`${gazetteerName}, feature ${propertyIndex}: ${property} is required`);
        }
      }
    };
  }

  return errors;
};

module.exports = lint;
