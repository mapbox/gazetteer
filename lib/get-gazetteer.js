const fs = require('fs');
const path = require('path');
const gazetteers = fs.readdirSync(path.resolve(__dirname,'../mapbox-streets'));

function get(gazetteerName) {
  for (gazetteer of gazetteers) {
    const filePath = path.resolve(__dirname,`../mapbox-streets/${gazetteer}`);
    const gazetteerData = JSON.parse(fs.readFileSync(filePath))

    if (gazetteerData.name === gazetteerName) {
      return gazetteerData;
      break;
    }
  }
  return new Error('No gazetteer with that name found');
};

module.exports = get;
