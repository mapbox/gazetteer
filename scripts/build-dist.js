const fs = require('fs');
const path = require('path');
const pify = require('pify');
const mkdirp = require('mkdirp');

const src = path.join(__dirname, '../src/');
const dist = path.join(__dirname, '../dist/');

function getGazetteerExport(dir, name) {
  const exportName = name
    .replace(/^\w/g, w => w.toUpperCase()) // capitalize first letter
    .replace(/([\-_]\w)/g, w => w[1].toUpperCase()); // remove dashes & underscores, capitalize next letter
  return `export const ${dir}${exportName} = require('./${dir}/${name}.json')\n`;
}

function writeGazetteersToDist(index) {
  return pify(fs.readdir)(path.join(src, 'gazetteers/')).then(dirs => {
    return Promise.all(
      dirs.map(dir => {
        const dirSrc = path.join(src, `gazetteers/${dir}`);
        return pify(fs.readdir)(dirSrc).then(files => {
          const dirDist = path.join(dist, dir);
          return pify(mkdirp)(dirDist).then(
            files
              .filter(f => f.match(/.json$/))
              .map(f =>
                pify(fs.readFile)(path.join(dirSrc, f), 'utf8').then(c => {
                  const parsed = JSON.parse(c);
                  const { name } = parsed;
                  index.write(getGazetteerExport(dir, name));
                  return pify(fs.writeFile)(
                    path.join(dirDist, `${name}.json`),
                    JSON.stringify(parsed),
                    'utf8'
                  );
                })
              )
          );
        });
      })
    );
  });
}

function writeUtilToDist(index) {
  const utilSrc = path.join(src, 'util/');
  const utilDist = path.join(dist, 'util/');
  return pify(fs.readdir)(utilSrc).then(files => {
    return pify(mkdirp)(utilDist).then(
      files
        .filter(f => f.match(/.js$/))
        .map(f => {
          return pify(fs.readFile)(path.join(utilSrc, f), 'utf8').then(c => {
            if (f === 'index.js') {
              // point dist directory
              index.write(c.replace(/(\.\/)/g, './util/'));
            } else {
              return pify(fs.writeFile)(path.join(utilDist, f), c, 'utf8');
            }
          });
        })
    );
  });
}

function build() {
  const indexPath = path.join(dist, 'index.js');
  return pify(mkdirp)(dist).then(
    pify(fs.open)(indexPath, 'w').then(() => {
      const index = fs.createWriteStream(indexPath, { flags: 'a' });
      writeGazetteersToDist(index).then(() => {
        writeUtilToDist(index).then(() => {
          console.log('✅ Dist directory ready');
        });
      });
    })
  );
}

module.exports = { build };

build().catch(err => console.error(err.stack));
