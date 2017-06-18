#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const config_1 = require("../src/config");
const doctor_1 = require("../src/doctor");
const wechaty_1 = require("../src/wechaty");
const wechaty = wechaty_1.default.instance();
const doctor = new doctor_1.default();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let ipcTestResult;
        const chromedriverVersion = doctor.chromedriverVersion();
        try {
            yield doctor.testTcp();
            ipcTestResult = 'PASS';
        }
        catch (err) {
            console.log(err);
            ipcTestResult = 'FAIL. Please check your tcp network, Wechaty need to listen on localhost and connect to it.';
        }
        console.log(`
  #### Wechaty Doctor

  1. Wechaty version: ${wechaty.version()}
  2. ${os.type()} ${os.arch()} version ${os.release()} memory ${Math.floor(os.freemem() / 1024 / 1024)}/${Math.floor(os.totalmem() / 1024 / 1024)} MB
  3. Docker: ${config_1.default.isDocker}
  4. Node version: ${process.version}
  5. Tcp IPC TEST: ${ipcTestResult}
  6. Chromedriver: ${chromedriverVersion}

  `);
    });
}
try {
    main();
}
catch (err) {
    console.error('main() exception: %s', err.message || err);
}
//# sourceMappingURL=doctor.js.map