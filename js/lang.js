// 八米科技官网 - 共享语言切换脚本
// 所有页面都需要引入这个脚本

(function() {
    'use strict';
    
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
        return lang || 'zh';
    }
    
    // 设置语言
    function setLang(lang) {
        if (lang !== 'zh' && lang !== 'en') lang = 'zh';
        // 同时设置新旧两个键，确保兼容性
        localStorage.setItem('bami_lang', lang);
        localStorage.setItem('bami-lang', lang);
        applyLang(lang);
        updateButtons(lang);
    }
    
    // 应用语言到页面
    function applyLang(lang) {
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
            } else if (el.classList.contains('zh') || el.classList.contains('en')) {
                el.style.display = 'none';
            }
        });
    }
    
    // 更新按钮状态
    function updateButtons(lang) {
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
    }
    
    // 初始化
    function init() {
        // 为所有语言按钮绑定事件
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = btn.getAttribute('data-lang');
                if (lang) setLang(lang);
            });
        });
        
        // 应用当前语言（页面加载时）
        var currentLang = getCurrentLang();
        applyLang(currentLang);
        updateButtons(currentLang);
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
        get: getCurrentLang
    };
})();
