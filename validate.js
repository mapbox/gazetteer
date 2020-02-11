'use strict';

const geojsonhint = require('@mapbox/geojsonhint');
const Joi = require('@hapi/joi');

const rootLevelSchema = Joi.object().keys({
  type: Joi.string()
    .valid('FeatureCollection')
    .required(),
  name: Joi.string().required(),
  features: Joi.array().required()
});

const propertiesSchema = Joi.object()
  .keys({
    place_name: Joi.string().required(),
    place_description: Joi.string(),
    zoom: Joi.number()
      .min(0)
      .max(22)
      .required(),
    pitch: Joi.number()
      .integer()
      .min(0)
      .max(60),
    bearing: Joi.number()
      .integer()
      .min(-179)
      .max(180),
    tags: Joi.array().items(Joi.string())
  })
  .unknown();

function validate(gazetteer) {
  const errors = [];

  geojsonhint.hint(gazetteer).forEach(err => {
    errors.push(err.message);
  });

  // Return early if errors were caught from geojsonhint.
  if (errors.length) return errors;

  const validateRoot = Joi.validate(gazetteer, rootLevelSchema);

  if (validateRoot.error && validateRoot.error.details.length) {
    return validateRoot.error.details.map(e => e.message);
  }

  gazetteer.features.forEach(feature => {
    const validateProperties = Joi.validate(
      feature.properties,
      propertiesSchema
    );
    if (validateProperties.error && validateProperties.error.details.length) {
      validateProperties.error.details.forEach(e => errors.push(e.message));
    }
  });

  return errors;
}

module.exports = validate;
