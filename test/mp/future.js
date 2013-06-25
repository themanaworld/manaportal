"use strict";
var vows = require("vows"),
    load = require("../load"),
    assert = require("assert"),
    jsdom = require("jsdom"),
    Canvas = require("canvas"),
    Image = Canvas.Image;

var suite = vows.describe("mp.dye");

var canvas = new Canvas(32,32);
var context = canvas.getContext("2d");

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

function loadImage(url, tests) {
    tests.topic = function() {
        var image = new Image;
        var tester = this;
        var callback = this.callback;
        var args = arguments;
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            callback = callback.bind(tester, false, context.getImageData(0, 0, image.width, image.height));
            callback.apply(tester, args);
        }
        image.onerror = function(err) {
            throw new Error("Error loading '" + url + "': " + err);
        }
        image.src = url;
    };
    return tests;
}

suite.addBatch({
    "The manaportal dye": {
        topic: load("mp/dye").expression("mp.dye").document(),
        "parseDyeString": {
            "Extracts a the dye channel data from the dyestring": function(dye) {
                assert.equal(dye.parseDyeString(dyeString), dyeData);
            }
        },
        "dyeImage": {
            "with the big recolorable cake": loadImage("test/data/bigcake.png", {
                "to the big white cake": loadImage("test/data/whitecake.png", {
                    "dyes correctly when given the correct dye data": function(err1, whiteCake, dyeableCake, dye) {
                        assert.deepEqual(dye.dyeImage(dyeableCake.data, dyeData), whiteCake.data);
                    }
                })
            })
        }
    }
});

suite.export(module);
