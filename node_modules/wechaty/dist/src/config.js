"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wechaty - Wechaty for Bot, Connect ChatBots, Chat as a Service
 *
 * https://github.com/wechaty/wechaty/
 */
const isCi = require('is-ci');
const isDocker = require('is-docker');
const brolog_1 = require("brolog");
exports.log = brolog_1.log;
const logLevel = process.env['WECHATY_LOG'];
if (logLevel) {
    brolog_1.log.level(logLevel.toLowerCase());
    brolog_1.log.silly('Brolog', 'WECHATY_LOG set level to %s', logLevel);
}
/**
 * to handle unhandled exceptions
 */
if (/verbose|silly/i.test(logLevel)) {
    brolog_1.log.info('Config', 'registering process.on("unhandledRejection") for development/debug');
    process.on('unhandledRejection', (reason, promise) => {
        brolog_1.log.error('Config', '###########################');
        brolog_1.log.error('Config', 'unhandledRejection: %s %s', reason, promise);
        brolog_1.log.error('Config', '###########################');
        promise.catch(err => {
            brolog_1.log.error('Config', 'unhandledRejection::catch(%s)', err.message);
            console.error('Config', err); // I don't know if log.error has similar full trace print support like console.error
        });
    });
}
/* tslint:disable:variable-name */
/* tslint:disable:no-var-requires */
exports.Config = require('../package.json').wechaty;
/**
 * 1. ENVIRONMENT VARIABLES + PACKAGES.JSON (default)
 */
Object.assign(exports.Config, {
    head: process.env['WECHATY_HEAD'] || exports.Config.DEFAULT_HEAD,
    puppet: process.env['WECHATY_PUPPET'] || exports.Config.DEFAULT_PUPPET,
    apihost: process.env['WECHATY_APIHOST'] || exports.Config.DEFAULT_APIHOST,
    validApiHost,
});
function validApiHost(apihost) {
    if (/^[a-zA-Z0-9\.\-\_]+:?[0-9]*$/.test(apihost)) {
        return true;
    }
    throw new Error('validApiHost() fail for ' + apihost);
}
validApiHost(exports.Config.apihost);
/**
 * 2. ENVIRONMENT VARIABLES (only)
 */
Object.assign(exports.Config, {
    port: process.env['WECHATY_PORT'] || null,
    profile: process.env['WECHATY_PROFILE'] || null,
    token: process.env['WECHATY_TOKEN'] || null,
    debug: !!(process.env['WECHATY_DEBUG']) || false,
});
/**
 * 3. Service Settings
 */
Object.assign(exports.Config, {
    // get PORT form cloud service env, ie: heroku
    httpPort: process.env['PORT'] || process.env['WECHATY_PORT'] || exports.Config.DEFAULT_PORT,
});
/**
 * 4. Envioronment Identify
 */
Object.assign(exports.Config, {
    isDocker: isWechatyDocker(),
    isGlobal: isWechatyInstalledGlobal(),
});
function isWechatyInstalledGlobal() {
    /**
     * TODO:
     * 1. check /node_modules/wechaty
     * 2. return true if exists
     * 3. otherwise return false
     */
    return false;
}
function isWechatyDocker() {
    /**
     * false for Continuous Integration System
     */
    if (isCi) {
        return false;
    }
    /**
     * false Cloud9 IDE
     */
    const c9 = Object.keys(process.env)
        .filter(k => /^C9_/.test(k))
        .length;
    if (c9 > 7 && process.env['C9_PORT']) {
        return false;
    }
    /**
     * return indentify result by NPM module `is-docker`
     */
    return isDocker();
}
function puppetInstance(instance) {
    if (instance === undefined) {
        if (!this._puppetInstance) {
            throw new Error('no puppet instance');
        }
        return this._puppetInstance;
    }
    else if (instance === null) {
        brolog_1.log.verbose('Config', 'puppetInstance(null)');
        this._puppetInstance = null;
        return;
    }
    brolog_1.log.verbose('Config', 'puppetInstance(%s)', instance.constructor.name);
    this._puppetInstance = instance;
    return;
}
Object.assign(exports.Config, {
    puppetInstance,
});
/**
 * ISSUE #72
 * Introduce the SELENIUM_PROMISE_MANAGER environment variable.
 * When set to 1, selenium-webdriver will use the existing ControlFlow scheduler.
 * When set to 0, the SimpleScheduler will be used.
 */
process.env['SELENIUM_PROMISE_MANAGER'] = 0;
exports.default = exports.Config;
//# sourceMappingURL=config.js.map