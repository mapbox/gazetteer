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

    if (feature.properties.tags) delete feature.properties.tags;

    if (feature.properties.highlights) {
      const tags = [];

      feature.properties.highlights.forEach(highlight => {
        const fields = highlight['data_layer_fields'];
        if (fields) {
          Object.keys(fields).forEach(key => {
            const value = fields[key];
            if (tags.indexOf(value) < 0) {
              tags.push(fields[key]);
            }
          });
        }
      });

      feature.properties.tags = tags;
      delete feature.properties.highlights;
    }

    return feature;
  });

  fs.writeFileSync(
    path.join(__dirname, `../../${directory}/${file}`),
    JSON.stringify(data, null, 2)
  );
});
