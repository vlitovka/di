'use strict'

module.exports = function (dep1, dep2, fs, util) {
    this.getDep1 = () => {
        return dep1;
    };

    this.getDep2 = () => {
        return dep2;
    };

    this.getDep3 = () => {
        return fs;
    };

    this.getDep4 = () => {
        return util;
    };
};