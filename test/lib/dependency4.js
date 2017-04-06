'use strict'

module.exports = function (fs, util) {
    this.test = false;

    this.getFs = function () {
        return fs;
    };

    this.getUtil = function () {
        return util;
    };
};