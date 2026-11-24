// BAMI website - Indonesian translation catalog and DOM translator.
// The catalog intentionally uses exact page copy so the page can switch between
// Chinese, English and Indonesian without creating a second copy of the site.
(function (window, document) {
    'use strict';

    var pairs = ((window.BAMI_NEWS_TRANSLATIONS || {}).id || []).concat(window.BAMI_ID_CATALOG || []);

    var exact = new Map();
    pairs.forEach(function (pair) {
        exact.set(pair[0], pair[1]);
    });

    var textSources = new WeakMap();
    var attributeSources = new WeakMap();
    var htmlSources = new WeakMap();
    var active = false;
    var observer = null;

    function hasChinese(value) {
        return /[\u3400-\u9fff]/.test(value);
    }

    function normalise(value) {
        return value.replace(/\u00a0/g, ' ').replace(/\r\n/g, '\n');
    }

    function translate(value) {
        if (typeof value !== 'string') return value;

        var normalised = normalise(value);
        var leading = (normalised.match(/^\s*/) || [''])[0];
        var trailing = (normalised.match(/\s*$/) || [''])[0];
        var core = normalised.trim();
        if (!core) return value;

        if (exact.has(core)) {
            return leading + exact.get(core) + trailing;
        }

        // No partial replacements here: mixing Indonesian terms into an
        // untranslated Chinese sentence is worse than reporting it in QA.
        return value;
    }

    function shouldSkip(element) {
        return !element || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(element.tagName);
    }

    function translateTextNode(node) {
        if (!node || !node.nodeValue) return;
        if (!textSources.has(node)) textSources.set(node, node.nodeValue);
        var source = textSources.get(node);
        var translated = translate(source);
        if (node.nodeValue !== translated) node.nodeValue = translated;
    }

    function translateAttributes(element) {
        if (!element || !element.attributes) return;
        var names = ['title', 'alt', 'placeholder', 'aria-label', 'value', 'content'];
        var originals = attributeSources.get(element);
        if (!originals) {
            originals = {};
            attributeSources.set(element, originals);
        }

        names.forEach(function (name) {
            if (!element.hasAttribute(name)) return;
            if (!Object.prototype.hasOwnProperty.call(originals, name)) {
                originals[name] = element.getAttribute(name);
            }
            var source = originals[name];
            var translated = translate(source);
            if (element.getAttribute(name) !== translated) {
                element.setAttribute(name, translated);
            }
        });
    }

    function translateTree(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
        if (root.nodeType === Node.ELEMENT_NODE) {
            if (shouldSkip(root)) return;
            translateAttributes(root);
        }

        var scope = root.nodeType === Node.ELEMENT_NODE ? root : document.documentElement;
        var dataElements = scope.matches && scope.matches('[data-zh]') ? [scope] : [];
        if (scope.querySelectorAll) {
            dataElements = dataElements.concat(Array.from(scope.querySelectorAll('[data-zh]')));
        }
        dataElements.forEach(function (element) {
            if (!htmlSources.has(element)) htmlSources.set(element, element.innerHTML);
            var source = element.getAttribute('data-zh');
            var translated = translate(source);
            if (translated !== source && element.innerHTML !== translated) {
                element.innerHTML = translated;
            }
        });

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (shouldSkip(node.parentElement)) return NodeFilter.FILTER_REJECT;
                var candidate = normalise(node.nodeValue || '').trim();
                return exact.has(candidate) || hasChinese(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });
        while (walker.nextNode()) translateTextNode(walker.currentNode);

        if (root.querySelectorAll) {
            root.querySelectorAll('[title], [alt], [placeholder], [aria-label], [content]').forEach(translateAttributes);
        }
    }

    function restoreTree(root) {
        if (!root) return;
        var scope = root.nodeType === Node.ELEMENT_NODE ? root : document.documentElement;
        if (scope.matches && htmlSources.has(scope)) scope.innerHTML = htmlSources.get(scope);
        if (scope.querySelectorAll) scope.querySelectorAll('*').forEach(function (element) {
            if (htmlSources.has(element)) element.innerHTML = htmlSources.get(element);
        });

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            var node = walker.currentNode;
            if (textSources.has(node) && node.nodeValue !== textSources.get(node)) {
                node.nodeValue = textSources.get(node);
            }
        }

        if (scope.matches && attributeSources.has(scope)) restoreAttributes(scope);
        if (scope.querySelectorAll) scope.querySelectorAll('*').forEach(function (element) {
            if (attributeSources.has(element)) restoreAttributes(element);
        });
    }

    function restoreAttributes(element) {
        var originals = attributeSources.get(element);
        if (!originals) return;
        Object.keys(originals).forEach(function (name) {
            element.setAttribute(name, originals[name]);
        });
    }

    function startObserver() {
        if (observer || !document.documentElement) return;
        observer = new MutationObserver(function (mutations) {
            if (!active) return;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'characterData') {
                    translateTextNode(mutation.target);
                    return;
                }
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        translateTree(node);
                    }
                });
            });
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function apply(root) {
        active = true;
        startObserver();
        if (!root && document.body) {
            translateTree(document.head);
            translateTree(document.body);
        } else {
            translateTree(root);
        }
    }

    function restore(root) {
        active = false;
        if (root) {
            restoreTree(root);
            return;
        }
        if (document.body) {
            restoreTree(document.body);
            restoreTree(document.head);
        }
    }

    window.BAMI_ID = {
        apply: apply,
        restore: restore,
        translate: translate,
        hasChinese: hasChinese,
        catalog: pairs
    };
})(window, document);
