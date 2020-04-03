'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const validate = require('./validate');

const DIRECTORIES = ['benchmark', 'worldwide', 'japan'];
DIRECTORIES.forEach(d => {
  fs.readdir(path.resolve(__dirname, `./${d}`), (err, gazetteers) => {
    if (err) throw new Error(err);
    gazetteers.forEach(gazetteer => {
      if (gazetteer === 'index.js') return;
      const filePath = path.resolve(__dirname, `./${d}/${gazetteer}`);
      const gazetteerData = JSON.parse(fs.readFileSync(filePath));
      const errors = validate(gazetteerData);
      assert(!errors.length, new Error(errors[0]));
    });
  });
});

const badTypeValue = {
  type: 'foo',
  name: '',
  features: ''
};

assert(
  validate(badTypeValue)[0] === 'The type foo is unknown',
  validate(badTypeValue)
);

const badDataTypeForFeatures = {
  type: 'FeatureCollection',
  name: '',
  features: ''
};

assert(
  validate(badDataTypeForFeatures)[0] ===
    '"features" member should be an array, but is an string instead',
  validate(badDataTypeForFeatures)
);

const emptyNameKey = {
  type: 'FeatureCollection',
  name: '',
  features: []
};

assert(
  validate(emptyNameKey)[0] === '"name" is not allowed to be empty',
  validate(emptyNameKey)
);

const noProperties = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(noProperties)[0] === '"place_name" is required',
  validate(noProperties)
);

const emptyPlaceNameProperties = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: ''
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(emptyPlaceNameProperties)[0] ===
    '"place_name" is not allowed to be empty',
  validate(emptyPlaceNameProperties)
);

const badDataTypePlaceDescription = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        place_description: 123
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(badDataTypePlaceDescription)[0] ===
    '"place_description" must be a string',
  validate(badDataTypePlaceDescription)
);

const missingZoom = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name'
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(missingZoom)[0] === '"zoom" is required',
  validate(missingZoom)
);

const overMaxZoom = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 23
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(overMaxZoom)[0] === '"zoom" must be less than or equal to 22',
  validate(overMaxZoom)
);

const acceptFloats = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 3.23
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(!validate(acceptFloats).length, validate(acceptFloats));

const underMinBearing = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 1,
        bearing: -180
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(underMinBearing)[0] ===
    '"bearing" must be larger than or equal to -179',
  validate(underMinBearing)
);

const overMaxPitch = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 1,
        pitch: 180
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(overMaxPitch)[0] === '"pitch" must be less than or equal to 60',
  validate(overMaxPitch)
);

const tagsRequireStrings = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 1,
        tags: [1, 2, 3]
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(
  validate(tagsRequireStrings)[0] === '"0" must be a string',
  validate(tagsRequireStrings)
);

const arbitraryFields = {
  type: 'FeatureCollection',
  name: 'Penny',
  features: [
    {
      type: 'Feature',
      properties: {
        place_name: 'Name',
        zoom: 3.23,
        activities: ['sleep', 'moping']
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    }
  ]
};

assert(validate(!arbitraryFields).length, validate(arbitraryFields));
