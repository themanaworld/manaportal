"use strict";
var vows = require("vows"),
    load = require("../load"),
    assert = require("../assert"),
    jsdom = require("jsdom");

var suite = vows.describe("mp.dye");

var dyeString = "R:#ede5b2,fff7bf;G:#cccccc,ffffff";
var dyeData = {
    "R": [
        [0xed, 0xe5, 0xb2],
        [0xff, 0xf7, 0xbf]
    ],
    "G": [
        [0xcc, 0xcc, 0xcc],
        [0xff, 0xff, 0xff]
    ]
};

function unshiftLoadImageBind(url, tests) {
    tests.topic = function() {
        var mp = arguments[arguments.length - 1];
        var tester = this;
        var args = arguments;
        mp.resource.loadImage(url, function(err, data) {
            if (err) {
                throw new Error("Error loading '" + url + "': " + data);
            }
            tester.callback.bind(tester, err, data).apply(tester, args);
        });
    };
    return tests;
}

function testDye(err, dyed, dyeable, mp) {
    var input = dyeable.data;
    var expected = dyed.data;
    var actual = new Uint8ClampedArray(input);
    mp.dye.dyeImage(actual, dyeData);
    assert.imageDataEqual(actual, expected, input, dyed.width);
}

suite.addBatch({
    "The manaportal dye": {
        topic: load("mp/dye", "mp/resource").expression("mp").document(),
        "dyeImage": {
            "with the big recolorable cake": unshiftLoadImageBind("test/data/bigcake.png", {
                "to the big white cake dyed by TMWW": unshiftLoadImageBind("test/data/whitecake.png", {
                    "dyes correctly when given the correct dye data": testDye
                })
            }),
            "with a gradient of all channels with all intensities": unshiftLoadImageBind("test/data/gradient.png", {
                "to a gradient of all channels with all intensities dyed by TMWW with the white cake dye": unshiftLoadImageBind("test/data/gradient-whitecakedye.png", {
                    "dyes correctly when given the correct dye data": testDye
                })
            })
        }
    }
});

suite.export(module);
