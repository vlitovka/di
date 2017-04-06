'use strict'

Function.prototype.ourTinyConstructor = function(argArray) {
    var constr = this;
    var inst = Object.create(constr.prototype);
    constr.apply(inst, argArray);
    return inst;
};

const CustomError = function (code, message) {
    this.message    = message;
    this.code       = code;
};

CustomError.prototype = new Error();

var di = function (fs, config, mode, dirName) {
    var dependencies = {};

    /**
     * Method which is responsible for config validation
     * @throws {Error}
     */
    var checkConfig = () => {
        if (config[mode] === undefined) {
            throw new CustomError('DI_ERROR_CONFIG_MODE', 'Wrong mode specified, ' + mode + ' should be present in config');
        }

        // checking consistency of config
        var modes = Object.keys(config);
        for (var i = 0; i < modes.length; i++) {
            let mode = modes[i];

            var deps = Object.keys(config[mode]);
            for (var j = 0; j < deps.length; j++) {
                var dependency = deps[j];

                if (config[mode][dependency].require === undefined || config[mode][dependency].args === undefined) {
                    throw new CustomError('DI_ERROR_CONFIG_DEPENDENCY', 'Wrong configuration for dependency ' + dependency + ' in ' + mode);
                }
            }
        }
    };

    /**
     * Preparing arguments before passing it to constructor. Should convert dependency name into real dependency.
     *
     * @param {string[]} args - names of arguments
     * @return {object[]}
     */
    var prepareArguments = (args) => {
        var result = [];

        for (var i = 0; i < args.length; i++) {
            result.push(this.get(args[i]));
        }

        return result;
    };

    /**
     * Trying to find specific file(path) otherwise will keep this variable as it is
     *
     * @param {string} file - relative filename
     * @return {string}
     */
    var getPath = (file) => {
        if (fs.existsSync(dirName + '/' + file)) {
            return dirName + '/' + file;
        }

        return file;
    };

    var checkAlternativeMode = function (dependency) {
        // getting list of modes, root level of config
        var modes = Object.keys(config);

        // going over the list of available modes
        for (var i = 0; i < modes.length; i++) {
            var currentMode = modes[i];

            // trying to find dependency in alternative modes, not in specified(mode)
            if (currentMode !== mode && config[currentMode][dependency] !== undefined) {
                return currentMode;
            }
        }

        return false;
    };

    /**
     * Getter for dependencies
     *
     * @param {string} dependency - Dependency's name
     * @throws {Error}
     */
    this.get = (dependency) => {
        if (dependencies[dependency] !== undefined) {
            return dependencies[dependency];
        } else {
            /**
             * Variable which stores current mode by default, alternative mode might be used in case if dependency does not
             * exists in current mode.
             */
            var curMode = mode,
                dep = false;

            if (config[curMode][dependency] === undefined && !(curMode = checkAlternativeMode(dependency))) {
                throw new CustomError('DI_ERROR_UNKNOWN_DEPENDENCY', 'There is no such dependency as ' + dependency + ' in mode ' + mode);
            }

            var args = prepareArguments.bind(this)(config[curMode][dependency].args);

            if (config[curMode][dependency].new !== undefined && config[curMode][dependency].new) {
                var lib = require(getPath.bind(this)(config[curMode][dependency].require));
                dep = args.length ? lib.ourTinyConstructor(args) : new lib();
            } else {
                dep = require(getPath.bind(this)(config[curMode][dependency].require));
            }

            if (config[curMode][dependency].store === undefined || config[curMode][dependency].store === true) {
                dependencies[dependency] = dep
            }

            return dep;
        }
    };

    /**
     * Implements possibility to manually import dependency with possibility for future usage.
     *
     * @param {string} name - name of dependency
     * @param {mixed} object - actual dependency
     */
    this.addDependency = (name, object) => {
        if (dependencies[name] !== undefined) {
            throw new CustomError('DI_ERROR_DUPLICATE_DEPENDENCY', 'Such dependency ' + name + ' already exists');
        }

        if (object === undefined) {
            throw new CustomError('DI_ERROR_UNDEFINED_DEPENDENCY', 'No dependency for ' + name + ' supplied');
        }

        dependencies[name] = object;
    };

    checkConfig.bind(this)();
};

module.exports = di;