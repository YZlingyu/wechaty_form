"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const index_1 = require("./index");
ava_1.test('PuppetWeb Module Exports', t => {
    t.truthy(index_1.PuppetWeb, 'should export PuppetWeb');
    t.truthy(index_1.Event, 'should export Event');
    t.truthy(index_1.Watchdog, 'should export Watchdog');
    t.truthy(index_1.Server, 'should export Server');
    t.truthy(index_1.Browser, 'should export Browser');
    t.truthy(index_1.Bridge, 'should export Bridge');
});
//# sourceMappingURL=index.spec.js.map