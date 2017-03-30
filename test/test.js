'use strict'

const expect        = require('chai').expect;
const config        = require('./config.json');
const dependency1m  = new (require('./lib/dependency1mock'));
const di            = require('../lib/di');
const fs            = require('fs');
const util          = require('util');
const instance      = new di(fs, config, 'test', __dirname);

describe('DI', () => {
    it ('Wrong config', (done) => {
        expect(() => { new di(fs, {}, 'test', __dirname) }).to.throw(Error);
        expect(() => { new di(fs, {test:{}, run: {'DEP':{}}}, 'test', __dirname) }).to.throw(Error);
        expect(() => { new di(fs, {test:{'DEP2':{}}, run: {'DEP':{}}}, 'test', __dirname) }).to.throw(Error);
        expect(() => { new di(fs, {test:{'DEP2':{}}, run: {'DEP3':{}}}, 'test', __dirname) }).to.throw(Error);
        expect(() => { new di(fs, {test:{'DEP':{}}, run: {'DEP':{}}}, 'test', __dirname) }).to.throw(Error);
        done();
    });

    it ('Wrong dependency', (done) => {
        expect(instance.get.bind(instance, 'wrongDep')).to.throw(Error);
        done();
    });

    it ('Correct dependencies', (done) => {
        expect(instance.get.bind(instance, 'DEPENDENCY1')).to.not.throw(Error);
        expect(instance.get.bind(instance, 'FS')).to.not.throw(Error);
        expect(instance.get.bind(instance, 'UTIL')).to.not.throw(Error);
        expect(instance.get('UTIL')).to.deep.equal(util);
        expect(instance.get('FS')).to.deep.equal(fs);
        expect(instance.get.bind(instance, 'DEPENDENCY1')).to.not.throw(Error);
        expect(instance.get('DEPENDENCY1')).to.deep.equal(dependency1m);
        expect(instance.get.bind(instance, 'DEPENDENCY3')).to.not.throw(Error);
        expect(instance.get('DEPENDENCY3').getDep1()).to.deep.equal(dependency1m);
        expect(instance.get('FS').existsSync('./test/config.json')).to.equal(true);
        expect(instance.get('DEPENDENCY3').getDep3()).to.deep.equal(instance.get('FS'));
        expect(instance.get('DEPENDENCY3').getDep3()).to.deep.equal(fs);
        expect(instance.get('DEPENDENCY3').getDep4()).to.deep.equal(util);
        done();
    });

    it ('addDependency', (done) => {
        expect(instance.addDependency.bind(instance, 'FS', fs)).to.throw(Error);
        expect(instance.addDependency.bind(instance, 'FS2')).to.throw(Error);
        expect(instance.addDependency.bind(instance, 'FS2', {})).to.not.throw(Error);
        expect(instance.addDependency.bind(instance, 'FS3', fs)).to.not.throw(Error);
        expect(instance.get('FS3').existsSync('./test/config.json')).to.equal(true);
        expect(instance.get('FS3')).to.deep.equal(fs);
        done();
    });
});