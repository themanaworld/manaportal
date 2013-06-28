var assert = require("assert");

assert = module.exports = Object.create(assert);

assert.isArray = function(actual, message) {
    if (!Array.isArray(actual)) {
        assert.fail(actual, null, message || "expected {actual} to be an Array", null, assert.isArray);
    }
};

assert.arrayEqual = function(actual, expected, message) {
    message = message || "expected {expected}, found {actual}";
    assert.isArray(actual);
    if (actual.length != expected.length) {
        assert.fail(actual, expected, message);
    }
    for (var i in actual) {
        if (Array.isArray(actual[i])) {
            assert.arrayEqual(actual[i], expected[i], message);
        } else if (actual[i] != expected[i]) {
            assert.fail(actual, expected, message);
        }
    }
};

assert.imageDataEqual = function(actual, expected, input, width) {
    assert.equal(actual.length, expected.length, "expected same " + expected.length + " pixel components, found " + actual.length);
    for (var i = 0; i != actual.length; i += 4) {
        var p = i / 4;
        var y = Math.floor(p / width);
        var x = p - y * width;
        var msg = "At (" + x + "," + y + "): "
                + "Input rgba(" + input   [i    ] + "," + input   [i + 1] + "," + input   [i + 2] + "," + input   [i + 3] + ") "
        + "should become rgba(" + expected[i    ] + "," + expected[i + 1] + "," + expected[i + 2] + "," + expected[i + 3] + "); "
                + "found rgba(" + actual  [i    ] + "," + actual  [i + 1] + "," + actual  [i + 2] + "," + actual  [i + 3] + ")";
        assert.equal(actual[i    ], expected[i    ], msg);
        assert.equal(actual[i + 1], expected[i + 1], msg);
        assert.equal(actual[i + 2], expected[i + 2], msg);
        assert.equal(actual[i + 3], expected[i + 3], msg);
    }
};


assert.dyeDataEqual = function(actual, expected) {
    var channels = ["R", "G", "Y", "B", "M", "C", "W"];
    for (var k in channels) {
        var shouldExist = channels[k] in expected;
        assert.equal(channels[k] in actual, shouldExist, (shouldExist ? "expected" : "unexpected") + " channel " + channels[k] + " in dye data.");
        if (!shouldExist) {
            continue;
        }
        assert.arrayEqual(actual[channels[k]], expected[channels[k]]);
    }
};
