"use strict";
var mp = function(mp) {
    mp.resource = {
        loadImage: loadImage,
        copyImageData: copyImageData,
        parseColor: parseColor
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
    
    function copyImageData(ctx, src) {
        var dst = ctx.createImageData(src.width, src.height);
        dst.data.set(src.data);
        return dst;
    }
    
    /*
     * Parses the given color string into an array of parts
     */
    function parseColor(colorString) {
        if (colorString[0] == "#") {
            colorString = colorString.substring(1);
        }
        
        if (colorString.length == 3) {
            var r = colorString[0] + colorString[0];
            var g = colorString[1] + colorString[1];
            var b = colorString[2] + colorString[2];
            return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
        }
        
        if (colorString.length == 6) {
            return [parseInt(colorString.substring(0,2), 16), parseInt(colorString.substring(2,4), 16), parseInt(colorString.substring(4,6), 16)]
        }
        
        // TODO others?
        
        return null;
    }
    
    return mp;
}(mp || {});
