const fs = require('fs');
const path = require('path');
const assert = require('assert');
const gazetteers = fs.readdirSync(path.resolve(__dirname,'./mapbox-streets'));
const lint = require('./lib/lint-gazetteer');

let gazetteerNames = [];

gazetteers.forEach(gazetteer => {
  const filePath = path.resolve(__dirname,`./mapbox-streets/${gazetteer}`);
  const gazetteerData = JSON.parse(fs.readFileSync(filePath));
  const errors = lint(gazetteerData);

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
