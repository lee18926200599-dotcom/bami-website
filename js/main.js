// 八米科技官网 - 主要JavaScript

// Security: HTTPS Force Redirect
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && !window.location.hostname.match(/^127\./)) {
    window.location.href = window.location.href.replace('http:', 'https:');
}

// Security: XSS Protection - Escape User Input Function
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Security: Sanitize URL Function
function sanitizeUrl(url) {
    if (typeof url !== 'string') return '#';
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const parsed = document.createElement('a');
    parsed.href = url;
    if (!allowedProtocols.includes(parsed.protocol)) {
        return '#';
    }
    return url;
}

// Security: Input Validation Function
function validateInput(input, type) {
    if (typeof input !== 'string') return false;
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]{7,20}$/,
        name: /^[\u4e00-\u9fa5a-zA-Z\s]{2,50}$/,
        company: /^[\u4e00-\u9fa5a-zA-Z0-9\s]{2,100}$/
    };
    return patterns[type] ? patterns[type].test(input) : true;
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticles();
    
    // 导航栏滚动效果
    initNavbar();
    
    // 数字滚动动画
    initCounterAnimation();
    
    // 滚动显示动画
    initScrollReveal();
    
    // 语言切换
    initLangSwitch();
    
    // 表单处理
    initFormHandler();
});

// 粒子背景
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;
            
            // 边界处理
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // 绘制粒子
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
            ctx.fill();
            
            // 绘制连线
            particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 * (1 - dist / 150)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    resize();
    createParticles();
    drawParticles();
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// 导航栏滚动效果
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// 数字滚动动画
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const decimal = counter.getAttribute('data-decimal') || 0;
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = start + (target - start) * easeOut;
                    
                    counter.textContent = current.toFixed(decimal);
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toFixed(decimal);
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// 滚动显示动画
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
                
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        el.classList.add('aos-init');
        observer.observe(el);
    });
}

// 语言切换
function initLangSwitch() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // 更新按钮状态
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换语言内容
            document.querySelectorAll('[data-zh][data-en]').forEach(el => {
                el.textContent = el.getAttribute('data-' + lang);
            });
            
            // 保存语言偏好
            localStorage.setItem('bami-lang', lang);
        });
    });
    
    // 恢复语言偏好
    const savedLang = localStorage.getItem('bami-lang');
    if (savedLang) {
        const btn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
        if (btn) btn.click();
    }
}

// 表单处理
function initFormHandler() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // 模拟提交
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('感谢您的咨询！我们的专家团队将在24小时内与您联系。');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 移动端菜单切换
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// 初始化移动端菜单
document.addEventListener('DOMContentLoaded', initMobileMenu);
