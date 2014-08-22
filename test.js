var assert = require('assert');
var gazetteer = require('./index.js');

assert.equal(Array.isArray(gazetteer), true);

// Validate all bookmarks.
for (var i = 0; i < gazetteer.length; i++) {
    assert.ifError(gazetteer.validate(gazetteer));
}

// Test validate API.
assert.equal(gazetteer.validate({}).toString(), 'Error: bookmarks must be an array');

// Name.
assert.equal(gazetteer.validate([{
    place_name: 5
}]).toString(), 'Error: bookmark 0 place_name must be a string of 255 characters or less', 'name type');
assert.equal(gazetteer.validate([{
    place_name: new Array(257).join('a')
}]).toString(), 'Error: bookmark 0 place_name must be a string of 255 characters or less', 'name length');

// Zoom.
assert.equal(gazetteer.validate([{
    zoom: 'asdf'
}]).toString(), 'Error: bookmark 0 zoom must be a number between 0 and 22', 'zoom type');
assert.equal(gazetteer.validate([{
    zoom: -1
}]).toString(), 'Error: bookmark 0 zoom must be a number between 0 and 22', 'zoom < 0');
assert.equal(gazetteer.validate([{
    zoom: 30
}]).toString(), 'Error: bookmark 0 zoom must be a number between 0 and 22', 'zoom > 22');
assert.equal(gazetteer.validate([{
    zoom: 10.5
}]).toString(), 'Error: bookmark 0 zoom must be a number between 0 and 22', 'zoom float');

// Center.
assert.equal(gazetteer.validate([{
    center: {0:0, 1:5}
}]).toString(), 'Error: bookmark 0 center must be an array in the form [lat,lng]', 'center type');
assert.equal(gazetteer.validate([{
    center: [0]
}]).toString(), 'Error: bookmark 0 center must be an array in the form [lat,lng]', 'center length');
assert.equal(gazetteer.validate([{
    center: [0,'asdf']
}]).toString(), 'Error: bookmark 0 center lng value must be between -180 and 180', 'center lng type');
assert.equal(gazetteer.validate([{
    center: [0,-190]
}]).toString(), 'Error: bookmark 0 center lng value must be between -180 and 180', 'center lng < -180');
assert.equal(gazetteer.validate([{
    center: [0,190]
}]).toString(), 'Error: bookmark 0 center lng value must be between -180 and 180', 'center lng > 180');
assert.equal(gazetteer.validate([{
    center: ['asdf',0]
}]).toString(), 'Error: bookmark 0 center lat value must be between -90 and 90', 'center lat type');
assert.equal(gazetteer.validate([{
    center: [-95,0]
}]).toString(), 'Error: bookmark 0 center lat value must be between -90 and 90', 'center lat type');
assert.equal(gazetteer.validate([{
    center: [95,0]
}]).toString(), 'Error: bookmark 0 center lat value must be between -90 and 90', 'center lat type');

// Tags.
assert.equal(gazetteer.validate([{
    tags: 'banana, orange'
}]).toString(), 'Error: bookmark 0 tags must be an array', 'tags type');
assert.equal(gazetteer.validate([{
    tags: [5,'orange']
}]).toString(), 'Error: bookmark 0 tag must be a string of 255 characters or less', 'tags tag type');
assert.equal(gazetteer.validate([{
    tags: [new Array(257).join('a')]
}]).toString(), 'Error: bookmark 0 tag must be a string of 255 characters or less', 'tags tag type');

// Required keys.
assert.equal(gazetteer.validate([{}]).toString(), 'Error: bookmark 0 place_name is required');
assert.equal(gazetteer.validate([{ place_name:'new york'}]).toString(), 'Error: bookmark 0 zoom is required');
assert.equal(gazetteer.validate([{ place_name:'new york', zoom:5}]).toString(), 'Error: bookmark 0 center is required');
assert.equal(gazetteer.validate([{ place_name:'new york', zoom:5, center:[0,0]}]), undefined);
