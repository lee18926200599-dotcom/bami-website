// Keep the static document visible while regional preference is resolved.
// Hiding the whole page until the IP lookup and language pack complete delays
// first paint by several seconds on slow networks.
(function (window, document) {
    'use strict';

    window.BAMI_LOCALE_READY = function () {
        // Kept for compatibility with older page scripts.
    };
})(window, document);
