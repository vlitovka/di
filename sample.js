'use strict'

const fs            = require('fs');
const config        = require('./test/config.json');

try {
    var di = new (require('./lib/di'))(fs, config, 'test', __dirname + '/test/');

    if (di.get('FS').existsSync('./test/config.json')) {
        console.log('file exists');
    } else {
        console.log('file does not exists');
    }
} catch (e) {
    console.log(e.code, e.message);
}
