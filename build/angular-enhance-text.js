(function(angular){

'use strict';


var app = angular.module('bernhardposselt.enhancetext', [])
.provider('enhanceTextFilter', function () {
    var smilies = {},
        isCaching = true,
        textCache = {};

    this.setSmilies = function (smiliesConfig) {
        smilies = smiliesConfig;
    };

    this.enableCaching = function (isEnabled) {
        isCaching = isEnabled;
    };

    this.$get = function () {
        return function (text) {

            var originalText = text;

            // hit cache first before replacing
            if (isCaching) {
                var cachedResult = textCache[text];
                if (cachedResult !== undefined) {
                    return cachedResult;
                }
            }

            // loop over smilies and replace them in the text
            var smileyKeys = Object.keys(smilies);
            for (i=0; i<smileyKeys.length; i++) {
                var smiley = smileyKeys[i];
                var smileyKeyPath = smilies[smiley];
                var replacement = '<img alt="' + smiley + '" src="' + 
                    smileyKeyPath + '"/>';
                
                text = text.replace(smiley, replacement);
            }

            // cache result
            if (isCaching) {
                textCache[originalText] = text;
            }

            return text;
        };
    };
});

})(angular, undefined);