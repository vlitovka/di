'use strict'

module.exports = function (fs, util, di) {
    this.test = false;

    this.getFs = function () {
        return fs;
    };

    this.getUtil = function () {
        return util;
    };

    this.getDi = function () {
        return di;
    };
};