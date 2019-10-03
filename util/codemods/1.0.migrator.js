#!/usr/bin/env node

/* Migration script for converting 0.0 spec gazetteers to 1.0 */

const fs = require('fs');
const path = require('path');
const directory = process.argv.slice(2)[0];

if (!directory)
  return console.log('Specify a Gazetteer directory (e.g worldwide)');

const gazetteers = fs
  .readdirSync(path.resolve(__dirname, `../../${directory}`))
  .filter(filename => filename.match(/\.json$/));

gazetteers.forEach(file => {
  let data = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../../${directory}/${file}`), 'utf8')
  );
  delete data['data-source'];

  data.features = data.features.map(feature => {
    if (feature.properties.description) {
      feature.properties['place_description'] = feature.properties.description;
      delete feature.properties.description;
    }

    if (feature.properties.highlights) delete feature.properties.highlights;

    if (feature.properties.tags) {
      const tags = [];

      Object.keys(feature.properties.tags).forEach(key => {
        tags.push(`${key}-${feature.properties.tags[key]}`);
      });

      feature.properties.tags = tags;
    }

    return feature;
  });

  fs.writeFileSync(
    path.join(__dirname, `../../${directory}/${file}`),
    JSON.stringify(data, null, 2)
  );
});
