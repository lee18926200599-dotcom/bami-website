// 八米科技官网 - 共享语言切换脚本
// 所有页面都需要引入这个脚本

(function() {
    'use strict';

    // Add future languages here. The dropdown and all page controls are
    // generated from this list, so no navigation markup changes are needed.
    var LANGUAGES = [
        { code: 'zh', label: '中文', htmlLang: 'zh-CN', ariaLabel: 'Chinese' },
        { code: 'en', label: 'English', htmlLang: 'en', ariaLabel: 'English' },
        { code: 'vi', label: 'Tiếng Việt', htmlLang: 'vi', ariaLabel: 'Vietnamese' },
        { code: 'th', label: 'ไทย', htmlLang: 'th', ariaLabel: 'Thai' },
        { code: 'id', label: 'Bahasa Indonesia', htmlLang: 'id', ariaLabel: 'Indonesian' }
    ];
    var languageByCode = {};
    LANGUAGES.forEach(function(language) {
        languageByCode[language.code] = language;
    });
    var languagePacks = {};
    var activeLanguagePack = null;
    var fullLanguageAssets = {
        vi: ['js/lang-news-content.js', 'js/lang-vi-content.js', 'js/lang-vi.js'],
        th: ['js/lang-news-content.js', 'js/lang-th-content.js', 'js/lang-th.js'],
        id: ['js/lang-news-content.js', 'js/lang-id-content.js', 'js/lang-id.js']
    };
    var loadingLanguagePacks = {};
    var preferenceKey = 'bami_lang_preference';
    var geoCacheKey = 'bami_geo_language';
    var geoCacheTimeKey = 'bami_geo_language_at';
    var geoCacheDuration = 6 * 60 * 60 * 1000;

    function getLanguage(lang) {
        return languageByCode[lang] || languageByCode.zh;
    }
    
    // 获取当前语言 - 兼容旧版本存储键
    function getCurrentLang() {
        // 优先使用新的存储键 bami_lang
        var lang = localStorage.getItem('bami_lang');
        if (!lang) {
            // 兼容旧版本 bami-lang
            lang = localStorage.getItem('bami-lang');
            if (lang) {
                // 迁移到新的存储键
                localStorage.setItem('bami_lang', lang);
            }
        }
        return getLanguage(lang).code;
    }

    function hasExplicitPreference() {
        try {
            var preference = localStorage.getItem(preferenceKey);
            if (preference === '1') return true;
            if (preference === '0') return false;

            // Existing visitors selected a language in the previous site version.
            // Preserve that saved choice and migrate it to the explicit-preference key.
            if (localStorage.getItem('bami_lang') || localStorage.getItem('bami-lang')) {
                localStorage.setItem(preferenceKey, '1');
                return true;
            }
            localStorage.setItem(preferenceKey, '0');
            return false;
        } catch (_) {
            return false;
        }
    }

    function markExplicitPreference() {
        try {
            localStorage.setItem(preferenceKey, '1');
        } catch (_) {}
    }

    function saveAutomaticLanguage(lang) {
        try {
            localStorage.setItem('bami_lang', lang);
            localStorage.setItem('bami-lang', lang);
        } catch (_) {}
    }

    function finishLocaleBoot() {
        if (typeof window.BAMI_LOCALE_READY === 'function') {
            window.BAMI_LOCALE_READY();
        }
    }
    
    var currentLang = 'zh';

    // 设置语言
    function setLang(lang) {
        var targetLang = getLanguage(lang).code;
        updateLanguageControls(targetLang);
        return ensureLanguagePack(targetLang).then(function() {
            markExplicitPreference();
            // 同时设置新旧两个键，确保兼容性
            localStorage.setItem('bami_lang', targetLang);
            localStorage.setItem('bami-lang', targetLang);
            updateLanguageUrl(targetLang);
            applyLang(targetLang);
            updateLanguageControls(targetLang);
            notifyLanguageChange(targetLang);
            return targetLang;
        });
    }

    function isSearchBot() {
        return /Googlebot|Bingbot|Baiduspider|YandexBot|DuckDuckBot|Applebot|GPTBot|ClaudeBot|CCBot|Bytespider|PetalBot|BingPreview|Slurp|facebookexternalhit|Twitterbot|LinkedInBot|AhrefsBot|SemrushBot/i.test(navigator.userAgent);
    }

    function languageForCountry(countryCode) {
        var code = String(countryCode || '').toUpperCase();
        if (['CN', 'HK', 'TW', 'MO'].indexOf(code) !== -1) return 'zh';
        if (code === 'VN') return 'vi';
        if (code === 'TH') return 'th';
        if (code === 'ID') return 'id';
        return 'en';
    }

    function cachedGeoLanguage() {
        try {
            var lang = sessionStorage.getItem(geoCacheKey);
            var timestamp = Number(sessionStorage.getItem(geoCacheTimeKey) || 0);
            if (lang && languageByCode[lang] && Date.now() - timestamp < geoCacheDuration) {
                return lang;
            }
        } catch (_) {}
        return null;
    }

    function cacheGeoLanguage(lang) {
        try {
            sessionStorage.setItem(geoCacheKey, lang);
            sessionStorage.setItem(geoCacheTimeKey, String(Date.now()));
        } catch (_) {}
    }

    async function fetchJsonWithTimeout(url, timeout) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, timeout);
        try {
            var response = await fetch(url, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit'
            });
            if (!response.ok) throw new Error('Geo IP request failed');
            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function detectLanguageByIp() {
        var cached = cachedGeoLanguage();
        if (cached) return cached;

        return new Promise(function(resolve) {
            var settled = false;
            var remaining = 2;

            function finish(lang) {
                if (settled) return;
                settled = true;
                cacheGeoLanguage(lang);
                resolve(lang);
            }

            function fail() {
                remaining -= 1;
                if (remaining === 0) finish('en');
            }

            fetchJsonWithTimeout('https://ipwho.is/', 1800).then(function(data) {
                if (!data || data.success === false) throw new Error('Unknown country');
                finish(languageForCountry(data.country_code));
            }).catch(fail);

            fetchJsonWithTimeout('https://ipinfo.io/json', 1800).then(function(data) {
                if (!data || !data.country) throw new Error('Unknown country');
                finish(languageForCountry(data.country));
            }).catch(fail);
        });
    }
    
    // 应用语言到页面
    function applyLang(lang) {
        var previousLang = currentLang;
        var restoredLanguagePack = false;
        currentLang = lang;

        // 当前语言的翻译包先恢复原文，再切换到目标语言
        if (activeLanguagePack && typeof activeLanguagePack.restore === 'function') {
            activeLanguagePack.restore();
            restoredLanguagePack = true;
        }
        activeLanguagePack = null;

        document.documentElement.lang = getLanguage(lang).htmlLang;
        if (document.body) {
            var languageClasses = Array.from(document.body.classList)
                .filter(function(className) { return className.indexOf('lang-') === 0; });
            var hasCorrectLanguageClass = languageClasses.length === 1 &&
                languageClasses[0] === 'lang-' + lang;
            if (!hasCorrectLanguageClass && (languageClasses.length || lang !== 'zh')) {
                languageClasses.forEach(function(className) { document.body.classList.remove(className); });
                document.body.classList.add('lang-' + lang);
            }
        }

        var languagePack = languagePacks[lang];
        if (languagePack && typeof languagePack.apply === 'function') {
            document.querySelectorAll('span.zh, span.en').forEach(function(el) {
                el.style.display = el.classList.contains('zh') ? 'inline' : 'none';
            });
            languagePack.apply();
            activeLanguagePack = languagePack;
            return;
        }

        // The static document is already Chinese. Avoid rewriting every data
        // attribute on the first paint when no language change is needed.
        if (lang === 'zh' && (previousLang === 'zh' || restoredLanguagePack)) {
            document.querySelectorAll('span.zh, span.en').forEach(function(el) {
                el.style.display = el.classList.contains('zh') ? 'inline' : 'none';
            });
            return;
        }

        // 方式1: 处理带 data-zh 和 data-en 属性的元素
        document.querySelectorAll('[data-zh][data-en]').forEach(function(el) {
            var text = el.getAttribute('data-' + lang);
            if (text) {
                // 检查内容是否包含HTML标签
                if (text.indexOf('<') >= 0 && text.indexOf('>') >= 0) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        
        // 方式2: 处理带 data-placeholder-zh 和 data-placeholder-en 属性的输入框
        document.querySelectorAll('[data-placeholder-zh][data-placeholder-en]').forEach(function(el) {
            var placeholder = el.getAttribute('data-placeholder-' + lang);
            if (placeholder) {
                el.placeholder = placeholder;
            }
        });
        
        // 方式3: 处理带 zh/en class 的span元素（cases.html使用的方式）
        document.querySelectorAll('span.zh, span.en').forEach(function(el) {
            if (el.classList.contains(lang)) {
                el.style.display = 'inline';
            } else if (lang === 'zh' && el.classList.contains('zh')) {
                el.style.display = 'inline';
            } else if (lang === 'en' && el.classList.contains('en')) {
                el.style.display = 'inline';
            } else if (el.classList.contains('zh') || el.classList.contains('en')) {
                el.style.display = 'none';
            }
        });
    }
    
    // 更新下拉框和兼容旧版按钮的状态
    function updateLanguageControls(lang) {
        document.querySelectorAll('.bami-language-select').forEach(function(select) {
            select.value = lang;
            select.setAttribute('aria-label', 'Select language / Chọn ngôn ngữ');
        });
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                if (btn.parentElement && btn.parentElement.classList.contains('bami-fallback-lang-switch')) {
                    btn.style.background = '#FF6B35';
                    btn.style.color = '#FFFFFF';
                }
            } else {
                btn.setAttribute('aria-pressed', 'false');
                if (btn.parentElement && btn.parentElement.classList.contains('bami-fallback-lang-switch')) {
                    btn.style.background = 'transparent';
                    btn.style.color = '#C5C9D6';
                }
            }
        });
    }

    function notifyLanguageChange(lang) {
        document.dispatchEvent(new CustomEvent('bami:languagechange', {
            detail: { lang: lang, language: getLanguage(lang) }
        }));
    }

    function updateLanguageUrl(lang) {
        if (!window.history || !window.history.replaceState) return;
        var url = new URL(window.location.href);
        if (lang === 'zh') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState(null, '', url.href);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            var canonicalUrl = new URL(canonical.href);
            if (lang === 'zh') {
                canonicalUrl.searchParams.delete('lang');
            } else {
                canonicalUrl.searchParams.set('lang', lang);
            }
            canonical.setAttribute('href', canonicalUrl.href);
            document.querySelectorAll('meta[property="og:url"]').forEach(function(meta) {
                meta.setAttribute('content', canonicalUrl.href);
            });
        }
    }

    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = function() { reject(new Error('Failed to load ' + src)); };
            document.head.appendChild(script);
        });
    }

    function currentPageKey() {
        var fileName = decodeURIComponent(window.location.pathname).split('/').pop() || 'index.html';
        fileName = fileName.replace(/\.html?$/i, '') || 'index';
        return fileName.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    }

    function pageLanguageAssets(lang) {
        if (!fullLanguageAssets[lang]) return null;
        return [
            'js/lang-packs/' + lang + '/' + currentPageKey() + '.js',
            'js/lang-' + lang + '.js'
        ];
    }

    function loadLanguageAssets(lang, assets) {
        return assets.reduce(function(chain, src) {
            return chain.then(function() { return loadScript(src); });
        }, Promise.resolve());
    }

    function registerLoadedLanguagePack(lang) {
        var pack = lang === 'vi' ? window.BAMI_VI : (lang === 'th' ? window.BAMI_TH : window.BAMI_ID);
        if (!pack) throw new Error('Language pack unavailable: ' + lang);
        var language = getLanguage(lang);
        registerLanguage(language, pack);
    }

    function ensureLanguagePack(lang) {
        if (languagePacks[lang] || !fullLanguageAssets[lang]) return Promise.resolve();
        if (loadingLanguagePacks[lang]) return loadingLanguagePacks[lang];

        var pageAssets = pageLanguageAssets(lang);
        loadingLanguagePacks[lang] = loadLanguageAssets(lang, pageAssets)
            .then(function() {
                registerLoadedLanguagePack(lang);
            })
            .catch(function() {
                // A newly added page may not have a generated page pack yet.
                return loadLanguageAssets(lang, fullLanguageAssets[lang]).then(function() {
                    registerLoadedLanguagePack(lang);
                });
            })
            .then(function() {
                delete loadingLanguagePacks[lang];
            })
            .catch(function(error) {
            delete loadingLanguagePacks[lang];
            throw error;
        });
        return loadingLanguagePacks[lang];
    }

    function injectStyles() {
        if (document.getElementById('bami-language-select-styles')) return;
        var style = document.createElement('style');
        style.id = 'bami-language-select-styles';
        style.textContent = [
            '.bami-language-select{appearance:none;-webkit-appearance:none;min-width:112px;height:36px;padding:0 34px 0 14px;border:1px solid rgba(255,107,53,.35);border-radius:20px;background-color:#1A2235;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1.5 6 6.5 11 1.5\' fill=\'none\' stroke=\'%23FF8A5C\' stroke-width=\'1.8\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;background-size:12px 8px;color:#fff;font:600 13px/1 Inter,"Noto Sans SC","Noto Sans Thai",Thonburi,sans-serif;cursor:pointer;outline:none;transition:border-color .2s,box-shadow .2s;}',
            '.bami-language-select:hover,.bami-language-select:focus{border-color:#FF6B35;box-shadow:0 0 0 3px rgba(255,107,53,.12);}',
            '.bami-language-select option{background:#1A2235;color:#fff;}',
            '.mobile-menu-footer .bami-language-select{margin:0 auto;min-width:132px;}',
            '.bami-fallback-language-select{position:fixed;right:16px;bottom:16px;z-index:10000;}'
        ].join('');
        document.head.appendChild(style);
    }

    function createLanguageSelect() {
        var select = document.createElement('select');
        select.className = 'bami-language-select';
        select.setAttribute('aria-label', 'Select language / Chọn ngôn ngữ');
        LANGUAGES.forEach(function(language) {
            var option = document.createElement('option');
            option.value = language.code;
            option.textContent = language.label;
            option.setAttribute('lang', language.htmlLang);
            option.setAttribute('aria-label', language.ariaLabel);
            select.appendChild(option);
        });
        return select;
    }

    function refreshLanguageOptions() {
        document.querySelectorAll('.bami-language-select').forEach(function(select) {
            var value = select.value || currentLang;
            select.innerHTML = '';
            LANGUAGES.forEach(function(language) {
                var option = document.createElement('option');
                option.value = language.code;
                option.textContent = language.label;
                option.setAttribute('lang', language.htmlLang);
                select.appendChild(option);
            });
            select.value = value;
        });
    }

    function registerLanguage(language, pack) {
        if (!language || !language.code || !language.label) return;
        var registered = {
            code: language.code,
            label: language.label,
            htmlLang: language.htmlLang || language.code,
            ariaLabel: language.ariaLabel || language.label
        };
        if (languageByCode[registered.code]) {
            Object.assign(languageByCode[registered.code], registered);
        } else {
            LANGUAGES.push(registered);
            languageByCode[registered.code] = registered;
        }
        if (pack && typeof pack.apply === 'function') {
            languagePacks[registered.code] = pack;
        }
        refreshLanguageOptions();
    }

    function enhanceLanguageSwitchers() {
        var holders = [];
        document.querySelectorAll('.lang-switch, .lang-switcher').forEach(function(holder) {
            holders.push(holder);
        });
        document.querySelectorAll('.lang-btn').forEach(function(button) {
            var holder = button.parentElement;
            if (holder && holders.indexOf(holder) === -1) holders.push(holder);
        });

        holders.forEach(function(holder) {
            if (holder.querySelector('.bami-language-select')) return;
            holder.innerHTML = '';
            holder.style.padding = '0';
            holder.style.background = 'transparent';
            holder.style.border = '0';
            holder.appendChild(createLanguageSelect());
        });
    }

    function ensureLanguageSwitch() {
        if (document.querySelector('.bami-language-select')) return;
        if (!document.body) return;

        var switcher = document.createElement('div');
        switcher.className = 'bami-fallback-language-select';
        switcher.setAttribute('aria-label', 'Chọn ngôn ngữ');
        switcher.appendChild(createLanguageSelect());
        document.body.appendChild(switcher);
    }
    
    // 初始化
    async function init() {
        injectStyles();
        enhanceLanguageSwitchers();
        ensureLanguageSwitch();

        document.querySelectorAll('.bami-language-select').forEach(function(select) {
            select.addEventListener('change', function() {
                setLang(select.value);
            });
        });

        // 兼容少量页面脚本自行生成的语言按钮
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = btn.getAttribute('data-lang');
                if (lang) setLang(lang);
            });
        });
        
        // 优先级：URL 指定语言 > 用户手动选择 > IP 自动识别
        var savedLang;
        var updateUrl = true;
        var pageLang = document.body && document.body.getAttribute('data-page-lang');
        var requestedLang = new URLSearchParams(window.location.search).get('lang');

        if (requestedLang && languageByCode[requestedLang]) {
            savedLang = requestedLang;
            markExplicitPreference();
        } else if (isSearchBot()) {
            // Search crawlers must see the static canonical language rather than
            // the crawler server's own IP-based location.
            savedLang = pageLang || 'zh';
            updateUrl = false;
        } else if (hasExplicitPreference()) {
            savedLang = getCurrentLang();
        } else {
            savedLang = await detectLanguageByIp();
            updateUrl = false;
        }

        try {
            await ensureLanguagePack(savedLang);
        } catch (error) {
            savedLang = 'en';
            await ensureLanguagePack(savedLang);
        }

        localStorage.setItem('bami_lang', savedLang);
        localStorage.setItem('bami-lang', savedLang);
        if (updateUrl) updateLanguageUrl(savedLang);
        applyLang(savedLang);
        updateLanguageControls(savedLang);
        notifyLanguageChange(savedLang);
        finishLocaleBoot();
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 暴露全局函数
    window.BAMI_LANG = {
        set: setLang,
        get: function() { return currentLang; },
        languages: LANGUAGES.slice()
    };
    window.BAMI_I18N = {
        register: registerLanguage,
        getLanguages: function() { return LANGUAGES.slice(); }
    };
})();
