/**
 * Copyright (c) 2013, Bernhard Posselt <dev@bernhard-posselt.com>
 * This file is licensed under the Lesser General Public License version 3 or later.
 * See the COPYING file.
 */
var app = angular.module('bernhardposselt.enhancetext', ['ngSanitize'])
.provider('enhanceTextFilter', function () {

    var options = {
            cache: true,
            newLineToBr: true,
            embedLinks: true,
            embeddedLinkTarget: '_blank',
            embedImages: true,
            embeddedImagesHeight: undefined,
            embeddedImagesWidth: undefined,
            embedVideos: true,
            embeddedVideosHeight: undefined,
            embeddedVideosWidth: undefined,
            embedYoutube: true,
            embeddedYoutubeHeight: undefined,
            embeddedYoutubeWidth: undefined,
            smilies: {}
        },
        textCache = {};

    this.setOptions = function (customOptions) {
        angular.extend(options, customOptions);
    };

    this.$get = ['$sanitize', '$sce', 'SmileyEnhancer', 'VideoEnhancer',
                 'NewLineEnhancer', 'ImageEnhancer', 'YouTubeEnhancer', 
                 'LinkEnhancer',
        function ($sanitize, $sce, SmileyEnhancer, VideoEnhancer, 
                 NewLineEnhancer, ImageEnhancer, YouTubeEnhancer,
                 LinkEnhancer) {

        return function (text) {
            var originalText = text;

            // hit cache first before replacing
            if (options.cache) {
                var cachedResult = textCache[text];
                if (angular.isDefined(cachedResult)) {
                    return cachedResult;
                }
            }

            text = $sanitize(text);
            text = SmileyEnhancer(text, options.smilies);

            if (options.embedImages) {
                text = ImageEnhancer(text, options.embeddedImagesHeight,
                                     options.embeddedVideosWidth, 
                                     options.embeddedLinkTarget);
            }

            if (options.embedVideos) {
                text = VideoEnhancer(text, options.embeddedImagesHeight, 
                                     options.embeddedVideosWidth);
            }

            if (options.embedYoutube) {
                text = YouTubeEnhancer(text, options.embeddedYoutubeHeight,
                                       options.embeddedYoutubeWidth);
            }

            if (options.newLineToBr) {
                text = NewLineEnhancer(text);
            }

            if (options.embedLinks) {
                text = LinkEnhancer(text, options.embeddedLinkTarget);
            }

            // trust result to able to use it in ng-bind-html
            text = $sce.trustAsHtml(text);

            // cache result
            if (options.cache) {
                textCache[originalText] = text;
            }

            return text;
        };
    }];


});