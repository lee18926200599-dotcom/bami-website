// Avoid showing the static Chinese/English markup before automatic locale
// selection completes. This script must run before the page body is rendered.
(function (window, document) {
    'use strict';

    var botPattern = /Googlebot|Bingbot|Baiduspider|YandexBot|DuckDuckBot|Applebot|GPTBot|ClaudeBot|CCBot|Bytespider|PetalBot|BingPreview|Slurp|facebookexternalhit|Twitterbot|LinkedInBot|AhrefsBot|SemrushBot/i;
    if (botPattern.test(navigator.userAgent)) return;

    var html = document.documentElement;
    var style = document.createElement('style');
    style.id = 'bami-locale-boot-style';
    style.textContent = 'html.bami-locale-pending{background:#0A0E1A}html.bami-locale-pending body{visibility:hidden}';
    document.head.appendChild(style);
    html.classList.add('bami-locale-pending');

    var timeoutId = window.setTimeout(function () {
        html.classList.remove('bami-locale-pending');
    }, 4500);

    window.BAMI_LOCALE_READY = function () {
        window.clearTimeout(timeoutId);
        html.classList.remove('bami-locale-pending');
    };
})(window, document);
