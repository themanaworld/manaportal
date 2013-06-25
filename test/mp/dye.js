"use strict";
var vows = require("vows"),
    load = require("../load"),
    assert = require("assert");

var suite = vows.describe("mp.dye");

suite.addBatch({
    "The manaportal dye": {
        topic: load("mp/dye").expression("mp.dye"),
        "getChannel": {
            topic: function(dye) { return dye.getChannel; },
            "returns null given pure black": function(f) {
                assert.equal(f([0,0,0]).channel, null);
            },
            "returns R given a pure red": function(f) {
                assert.equal(f([255,0,0]).channel, "R");
                assert.equal(f([12,0,0]).channel, "R");
            },
            "returns G given a pure green": function(f) {
                assert.equal(f([0,255,0]).channel, "G");
                assert.equal(f([0,50,0]).channel, "G");
            },
            "returns B given a pure blue": function (f) {
                assert.equal(f([0,0,255]).channel, "B");
                assert.equal(f([0,0,23]).channel, "B");
            },
            "returns C given a pure cyan": function (f) {
                assert.equal(f([0,255,255]).channel, "C");
                assert.equal(f([0,90,90]).channel, "C");
            },
            "returns M given a pure magenta": function (f) {
                assert.equal(f([255,0,255]).channel, "M");
                assert.equal(f([62,0,62]).channel, "M");
            },
            "returns Y given a pure yellow": function (f) {
                assert.equal(f([255,255,0]).channel, "Y");
                assert.equal(f([70,70,0]).channel, "Y");
            },
            "returns W given a pure white": function (f) {
                assert.equal(f([255,255,255]).channel, "W");
                assert.equal(f([100,100,100]).channel, "W");
            },
            "returns null given an impure color": function(f) {
                assert.equal(f([12,34,56]).channel, null);
                assert.equal(f([55,53,55]).channel, null);
                assert.equal(f([0,128,254]).channel, null);
            }
        }
    }
});

suite.export(module);
