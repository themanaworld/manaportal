"use strict";
var mp = function(mp) {
    mp.resource = {
        loadImage: loadImage
    };

    /*
     * Quick compatability workaround
     *  node testing environment needs new Canvas() and won't tolerate document.createElement("canvas")
     *  A createCanvas method is therefore provided in its sandbox which can be quickly checked to determine the method needed
     */
    var createCanvas = "createCanvas" in document ? document.createCanvas : function() { return document.createElement("canvas"); };

    var canvas = createCanvas();
    var context = canvas.getContext("2d");

    /*
     * Load in an image given a URL.
     * The provided callback will fire when loading is complete.
     * The parameters will be false and the the imageData if successful, and false and the error otherwise.
     */
    function loadImage(url, callback) {
        var image = new Image();
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            callback(false, context.getImageData(0, 0, image.width, image.height));
        };
        image.onerror = function(err) {
            callback(true, err);
        };
        image.src = url;
    }
    return mp;
}(mp || {});
