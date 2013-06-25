"use strict";
process.env.TZ = "UTC";

var smash = require("smash"),
    jsdom = require("jsdom");

module.exports = function() {
    var files = [].slice.call(arguments).map(function(d) { return "public/js/" + d; }),
        expression = "mp",
        sandbox = {},
        domString = "<html><head></head><body></body></html>";

    function topic() {
        smash.load(files, expression, sandbox, this.callback);
    }

    topic.expression = function(_) {
        expression = _;
        return topic;
    };

    topic.dom = function(_) {
        if (!arguments.length) return domString;
        domString = _;
        return topic;
    };

    topic.body = function(_) {
        topic.dom("<html><head></head><body>" + _ + "</body></html>");
        return topic;
    };

    topic.document = function(_) {
        var document = arguments.length ? _ : jsdom.jsdom(domString);

        document.createRange = function() {
            return {
                selectNode: function() {},
                createContextualFragment: jsdom.jsdom
            };
        };

        sandbox = {
            console: console,
            document: document,
            window: document.createWindow(),
        };

        return topic;
    };

    return topic;
};

process.on("uncaughtException", function(e) {
    console.trace(e.stack);
});
