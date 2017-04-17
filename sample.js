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

    var test1 = { a1: 1, a2: 2 };
    var test2 = { a3: 3 };
    var test3 = di.get('UTIL')._extend(test1, test2);
    if (test3.a3 === test2.a3) {
        console.log('merged');
    } else {
        console.log('does not merged correctly');
    }
} catch (e) {
    console.log(e.code, e.message);
}
