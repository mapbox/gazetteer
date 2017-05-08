var assert = require('assert');
var gazetteer = require('./mapbox-streets-gazetteer.json');

function validate(data) {
    var features = data.features;
    for (var i = 0;  i < features.length; i++) {

        var feature = features[i];
        if (feature.geometry.type !== 'Point')
            return new Error('feature ' + i + ' must be type: Point.');

        var center = feature.geometry.coordinates;
        if (typeof center[0] !== 'number' || center[0] < -180 || center[0] > 180)
            return new Error('feature ' + i + ' center lng value must be between -180 and 180');
        if (typeof center[1] !== 'number' || center[1] < -90 || center[1] > 90)
            return new Error('feature ' + i + ' center lat value must be between -90 and 90');

        for (var key in feature.properties) {
            var val = feature.properties[key];

            switch (key) {
            case 'place_name':
                if (typeof val !== 'string' || val.length > 255)
                    return new Error('feature ' +i+ ' place_name must be a string of 255 characters or less');
                break;
            case 'zoom':
                if (typeof val !== 'number' || val < 0 || val > 22 || Math.floor(val) !== val)
                    return new Error('feature ' +i+ ' zoom must be a number between 0 and 22');
                break;
            case 'highlights':
                if (!Array.isArray(val))
                    return new Error('feature ' +i+ ' highlights must be an array');
                for (var k = 0; k < val.length; k++) {
                    if (typeof val[k].data_layer !== 'string' || val[k].length > 255)
                        return new Error('feature ' +i+ ' highlight ' +k+ ' data_layer must be a string of 255 characters or less');
                    if (typeof val[k].data_layer_fields !== 'object')
                        return new Error('feature ' +i+ ' highlight ' +k+ ' data_layer_fields must be an object');
                }
                break;
            }

            var required = ['place_name', 'zoom', 'highlights'];
            for (var j = 0; j < required.length; j++) {
                if (!(required[j] in feature.properties)) {
                    return new Error('feature ' + i + ' ' + required[j] + ' is required');
                }
            }
        }
    }
}

// Validate all features.
assert.ifError(validate(gazetteer));
