const fs = require('fs');
const path = require('path');
const assert = require('assert');
const lint = require('./util/lint-gazetteer');
const geojsonhint = require('@mapbox/geojsonhint');

const DIRECTORIES = ['benchmark', 'worldwide'];

DIRECTORIES.forEach(d => {
  fs.readdir(path.resolve(__dirname, `./${d}`), (err, gazetteers) => {
    if (err) return reject(err);

    gazetteers.forEach(gazetteer => {
      if (gazetteer === 'index.js') return;
      const filePath = path.resolve(__dirname, `./${d}/${gazetteer}`);
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
      assert(!errors.length, new Error(errors[0]));
    });
  });
});

console.log('All gazetteers are valid ✅');
