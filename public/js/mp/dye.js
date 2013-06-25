"use strict";
var mp = function(mp) {
    mp.dye = {
        getChannel: getChannel,
        parseDyeString: parseDyeString,
        dyeImage: dyeImage
    };
    var channel = [null, "R", "G", "Y", "B", "M", "C", "W"];
    function getChannel(color) {
        var r = color[0], g = color[1], b = color[2],
            max = Math.max(r, g, b);

        if (max == 0) {
            // Black
            return { channel: null, intensity: 0 };
        }

        var min = Math.min(r, g, b), intensity = r + g + b;

        var idx;

        if (min != max && (min != 0 || (intensity != max && intensity != 2 * max))) {
            // Not pure
            idx = 0;
        } else {
            idx = (r != 0) | ((g != 0) << 1) | ((b != 0) << 2);
        }

        return { channel: channel[idx], intensity: max };
    }
    function parseDyeString(dyeString) {
        /* TODO */
    }
    function dyeImage(imageData, dyeData) {
        /* TODO */
    }
    return mp;
}(mp || {});
