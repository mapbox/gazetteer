const geojsonhint = require('@mapbox/geojsonhint');

function lintGazetteer(gazetteer) {
  const errors = [];
  let { name } = gazetteer;

  if (typeof name !== 'string') {
    errors.push('gazetteer must have a name property of type string');
    name = '';
  }

  geojsonhint.hint(gazetteer).forEach(err => {
    errors.push(`${name} ${err.message}`);
  });

  gazetteer.features.forEach((feature, index) => {
    const { geometry, properties } = feature;

    if (geometry.type !== 'Point') {
      errors.push(`${name} feature[${index}]: must be type: Point`);
    }

    if (properties) {
      if (!properties['place_name']) {
        errors.push(`${name} feature[${index}]: place_name is required`);
      }

      if (typeof properties['zoom'] !== 'number') {
        errors.push(`${name} feature[${index}]: a valid zoom is required`);
      }

      Object.keys(properties).forEach(key => {
        const value = properties[key];

        switch (key) {
          case 'place_name':
            if (typeof value !== 'string' || value.length > 255) {
              errors.push(
                `${name} feature[${index}]: place_name must be a string of 255 characters or less`
              );
            }
            break;

          case 'zoom':
            if (value < 0 || value > 22) {
              errors.push(
                `${name} feature[${index}]: zoom must be a number between 0 and 22`
              );
            }
            break;

          case 'place_description':
            if (typeof value !== 'string') {
              errors.push(
                `${name} feature[${index}]: description must be a string`
              );
            }
            break;

          case 'tags':
            if (!Array.isArray(value)) {
              errors.push(`${name} feature[${index}]: tags must be an array`);

              value.forEach(v => {
                if (typeof value !== 'string') {
                  errors.push(`${name} tag "${v}" must be an string`);
                }
              });
            }
            break;
        }
      });
    }
  });

  return errors;
}

module.exports = lintGazetteer;
