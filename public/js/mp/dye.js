"use strict";
var mp = function(mp) {
    mp.dye = {
        getChannel: getChannel,
        parseDyeString: parseDyeString,
        asDyeString: asDyeString,
        dyeImage: dyeImage
    };
    
    var channel = [null, "R", "G", "Y", "B", "M", "C", "W"];
    
    /*
     * Return the channel and intensity for the given RGB(A) array.
     */
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
    
    /*
     * Return a dye specification from a dye string.
     */
    function parseDyeString(dyeString) {
        var channelStrings = dyeString.split("|");
        var dyeData = {};
        
        for (var i = 0; i < channelStrings.length; i++) {
            var channelStr = channelStrings[i];
            if (channelStr[1] != ":" || channelStr[2] != "#") {
                // TODO error
            }
            
            var channel = channelStr[0];
            var parts = channelStr.substring(3).split(",");
            
            var list = [];
            
            for (var j = 0; j < parts.length; j++) {
                list.push(mp.resource.parseColor(parts[j]));
            }
            
            dyeData[channel] = list;
        }
        
        return dyeData;
    }
    
    /*
     * Return a dye string matching the given dye specification.
     */
    function asDyeString(dye) {
        var dyeString = "";
        
        // skip null channel
        for (var i = 1; i < channel.length; i++) {
            var dyeChannel = channel[i];
            var dyeParts = dye[dyeChannel];
            if (!dyeParts || dyeParts.length == 0) {
                continue;
            }
            
            dyeString += dyeChannel + ":#";
            
            for (var j = 0; j < dyeParts.length; j++) {
                var color = dyeParts[j];
                dyeString += color[0].toString(16) + color[1].toString(16) + color[2].toString(16) + ",";
            }
            
            dyeString = dyeString.slice(0, -1);
            
            dyeString += "|";
        }
        
        if (dyeString.length > 0) {
            dyeString = dyeString.slice(0, -1);
        }
        
        return dyeString;
    }
    
    /*
     * Dye the internal image data based on the specification provided by dyeData.
     * The specification can be generated from a dyeString by parseDyeString.
     * The array passed in will be modified.
     */
    function dyeImage(imageData, dyeData) {
        for (var p = 0; p < imageData.length; p += 4) {
            var pixel = [imageData[p], imageData[p + 1], imageData[p + 2]];
            var alpha = imageData[p + 3];
            
            // Skip fully transparent pixels
            if (!alpha) {
                continue;
            }

            var channel = getChannel(pixel);
            var channelId = channel.channel;
            var intensity = channel.intensity;

            // If this is an unknown dye channel, an empty dye channel, not a pure color, or black, skip it
            if (!channelId || !(channelId in dyeData) || !dyeData[channelId].length || intensity == 0) {
                continue;
            }

            // Scale the intensity from 0-255 to the palette size (i is the palette index, t is the remainder)
            var val = intensity * dyeData[channelId].length
            var i = Math.floor(val / 255);
            var t = val - i * 255;
            
            // If we exactly hit one of the palette colors, just use it
            if (!t) {
                --i;
                imageData[p    ] = dyeData[channelId][i][0];
                imageData[p + 1] = dyeData[channelId][i][1];
                imageData[p + 2] = dyeData[channelId][i][2];
                continue;
            }

            // If we're between two palette colors, interpolate between them (the first color in a palette is implicitly black)
            imageData[p    ] = ((255 - t) * (i && dyeData[channelId][i - 1][0]) + t * dyeData[channelId][i][0]) / 255;
            imageData[p + 1] = ((255 - t) * (i && dyeData[channelId][i - 1][1]) + t * dyeData[channelId][i][1]) / 255;
            imageData[p + 2] = ((255 - t) * (i && dyeData[channelId][i - 1][2]) + t * dyeData[channelId][i][2]) / 255;
        }
        /* TODO */
        return imageData;
    }
    return mp;
}(mp || {});
