module.exports = require('./gazetteer.json');
module.exports.validate = validate;

function validate(bookmarks) {
    if (!Array.isArray(bookmarks))
        return new Error('bookmarks must be an array');

    for (var i = 0;  i < bookmarks.length; i++) {
        for (var key in bookmarks[i]) {
            var bookmark = bookmarks[i];
            var val = bookmarks[i][key];

            switch (key) {
            case 'tags':
                if (!Array.isArray(val))
                    return new Error('bookmark ' +i+ ' tags must be an array');
                for (var k = 0; k < val.length; k++) {
                    if (typeof val[k] !== 'string' || val[k].length > 255) return new Error('bookmark ' +i+ ' tag must be a string of 255 characters or less');
                }
                break;
            case 'place_name':
                if (typeof val !== 'string' || val.length > 255)
                    return new Error('bookmark ' +i+ ' place_name must be a string of 255 characters or less');
                break;
            case 'zoom':
                if (typeof val !== 'number' || val < 0 || val > 22 || Math.floor(val) !== val)
                    return new Error('bookmark ' +i+ ' zoom must be a number between 0 and 22');
                break;
            case 'center':
                if (!Array.isArray(val) || val.length !== 2)
                    return new Error('bookmark ' +i+ ' center must be an array in the form [lat,lng]');
                if (typeof val[0] !== 'number' || val[0] < -90 || val[0] > 90)
                    return new Error('bookmark ' +i+ ' center lat value must be between -90 and 90');
                if (typeof val[1] !== 'number' || val[1] < -180 || val[1] > 180)
                    return new Error('bookmark ' +i+ ' center lng value must be between -180 and 180');
                break;
            }
        }

        var required = ['place_name', 'zoom', 'center'];
        for (var j = 0; j < required.length; j++) {
            if (!(required[j] in bookmarks[i])) {
                return new Error('bookmark ' +i+ ' ' + required[j] + ' is required');
            }
        }
    }
}
