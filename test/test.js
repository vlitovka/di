'use strict'

const expect        = require('chai').expect;
const config        = require('./config.json');
const di            = require('../lib/di');
const fs            = require('fs');
const util          = require('util');
const dependency1m  = new (require('./lib/dependency1mock'));
const dependency2m  = new (require('./lib/dependency2mock'));
const dependency4   = new (require('./lib/dependency4'))(fs, util);
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
        expect(instance.get('DEPENDENCY2')).to.deep.equal(dependency2m);
        expect(instance.get('FS').existsSync('./test/config.json')).to.equal(true);
        expect(instance.get('DEPENDENCY3').getDep1()).to.deep.equal(dependency1m);
        expect(instance.get('DEPENDENCY3').getDep2()).to.deep.equal(dependency2m);
        expect(instance.get('DEPENDENCY3').getDep3()).to.deep.equal(fs);
        expect(instance.get('DEPENDENCY3').getDep3()).to.deep.equal(instance.get('FS'));
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

    it ('checking retrieval of dependency from other scope', (done) => {
        expect(instance.get.bind(instance, 'DEPENDENCY4')).to.not.throw(Error);
        expect(instance.get('DEPENDENCY4').getFs()).to.deep.equal(fs);
        expect(instance.get('DEPENDENCY4').getUtil()).to.deep.equal(util);
        expect(instance.get.bind(instance, 'DEPENDENCY5')).to.throw(Error);
        done();
    });

    it ('should handle store flag in dependencie\'s config', (done) => {
        var dep1 = instance.get('DEPENDENCY4');
        var dep2 = instance.get('DEPENDENCY4');
        dep1.test = 1;
        dep2.test = 3;
        expect(dep1).to.not.deep.equal(dep2);
        expect(dep1.test).to.equal(1);
        expect(dep2.test).to.equal(3);
        done();
    });

    it ('Should handle DI dependency', (done) => {
        expect(instance.get('DEPENDENCY4').getDi()).to.deep.equal(instance);
        done();
    });
});