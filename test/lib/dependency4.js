'use strict'

module.exports = function (fs, util) {

    this.getFs = function () {
        return fs;
    };

    this.getUtil = function () {
        return util;
    };
};