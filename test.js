const fs = require('fs');
const path = require('path');
const assert = require('assert');
const gazetteers = fs.readdirSync(path.resolve(__dirname,'./mapbox-streets'));
const lint = require('./lib/lint-gazetteer');
const geojsonhint = require('@mapbox/geojsonhint');

let gazetteerNames = [];

gazetteers.forEach(gazetteer => {
  const filePath = path.resolve(__dirname,`./mapbox-streets/${gazetteer}`);
  const gazetteerData = JSON.parse(fs.readFileSync(filePath));

  const errors = [];

  const geojsonErrors = geojsonhint.hint(gazetteerData);
  if (geojsonErrors.length > 0) {
    geojsonErrors.forEach(error => {
      errors.push(error.message);
    });
  }

  const gazetteerLintErrors = lint(gazetteerData);
  if (gazetteerLintErrors.length > 0) {
    gazetteerLintErrors.forEach(error => {
      errors.push(error);
    });
  }

  // Lint all features.
  assert(
    !errors.length,
    new Error(errors[0])
  );

  // Check if name is unique.
  assert(
    !gazetteerNames.includes(gazetteerData.name),
    new Error(`Gazetteer names must be unique: check for duplicates of ${gazetteerData.name}`)
  );

  gazetteerNames.push(gazetteerData.name);
});

console.log('All gazetteers are valid ✅');
