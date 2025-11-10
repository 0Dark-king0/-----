// تحميل الصفحة والإعدادات الأولية
document.addEventListener('DOMContentLoaded', function() {
    // إصلاح مشكلة اختفاء المحتوى أولاً
    ensureContentVisibility();
    
    initializeCodeCopy();
    initializeCodeRunner();
    initializeSmoothScrolling();
    initializeSearchFunctionality();
    initializeProgressIndicator();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeParticleBackground();
    initializeMobileMenu();
    loadUserPreferences();
});

// ضمان ظهور المحتوى
function ensureContentVisibility() {
    // إزالة أي تأثيرات قد تخفي المحتوى
    const allSections = document.querySelectorAll('.content section, .content article');
    allSections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.display = 'block';
        section.style.transform = 'none';
    });
    
    // التأكد من ظهور المحتوى الرئيسي
    const content = document.querySelector('.content');
    if (content) {
        content.style.opacity = '1';
        content.style.visibility = 'visible';
        content.style.display = 'block';
    }
    
    console.log('تم إصلاح مشكلة ظهور المحتوى');
}

// وظيفة نسخ الكود المحسنة
function initializeCodeCopy() {
    document.querySelectorAll('pre').forEach(pre => {
        // إضافة زر النسخ
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = '📋 نسخ';
        copyBtn.className = 'copy-btn';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255,255,255,0.9);
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const code = pre.querySelector('code').textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                copyBtn.innerHTML = '✅ تم النسخ';
                copyBtn.style.background = '#4CAF50';
                copyBtn.style.color = 'white';
                
                setTimeout(() => {
                    copyBtn.innerHTML = '📋 نسخ';
                    copyBtn.style.background = 'rgba(255,255,255,0.9)';
                    copyBtn.style.color = 'black';
                }, 2000);
            } catch (err) {
                console.error('فشل في نسخ الكود:', err);
                showNotification('فشل في نسخ الكود', 'error');
            }
        });
    });
}

// وظيفة تشغيل الكود التفاعلي
function initializeCodeRunner() {
    window.tryCode = function(button) {
        const example = button.closest('.example');
        const code = example.querySelector('pre code').textContent;
        
        // إنشاء نافذة معاينة
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        
        let htmlContent;
        
        if (code.includes('<!DOCTYPE html>')) {
            // كود HTML كامل
            htmlContent = code;
        } else if (code.includes('console.log') || code.includes('alert') || code.includes('document.')) {
            // كود JavaScript
            htmlContent = `
                <!DOCTYPE html>
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>تجربة الكود</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
                        #output { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px; }
                        #demo { background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h2>نتيجة تشغيل الكود:</h2>
                    <div id="demo">هذا عنصر تجريبي</div>
                    <div id="output"></div>
                    <script>
                        // إعادة تعريف console.log لعرض النتائج
                        const originalLog = console.log;
                        console.log = function(...args) {
                            originalLog.apply(console, args);
                            const output = document.getElementById('output');
                            output.innerHTML += args.join(' ') + '<br>';
                        };
                        
                        try {
                            ${code}
                        } catch (error) {
                            document.getElementById('output').innerHTML = 'خطأ: ' + error.message;
                        }
                    </script>
                </body>
                </html>
            `;
        } else {
            // كود CSS
            htmlContent = `
                <!DOCTYPE html>
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>تجربة CSS</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
                        ${code}
                    </style>
                </head>
                <body>
                    <h1>عنوان تجريبي</h1>
                    <p class="highlight">هذه فقرة تجريبية</p>
                    <div id="container">
                        <div class="flex-container">
                            <div class="flex-item">عنصر 1</div>
                            <div class="flex-item">عنصر 2</div>
                            <div class="flex-item">عنصر 3</div>
                        </div>
                    </div>
                    <button class="btn">زر تجريبي</button>
                </body>
                </html>
            `;
        }
        
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
    };
}

// التمرير السلس للروابط الداخلية
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // تمييز العنصر المستهدف
                targetElement.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
}

// وظيفة البحث
function initializeSearchFunctionality() {
    // إضافة مربع البحث
    const searchContainer = document.createElement('div');
    searchContainer.innerHTML = `
        <div style="position: fixed; top: 20px; left: 20px; z-index: 1001;">
            <input type="text" id="searchInput" placeholder="ابحث في المحتوى..." 
                   style="padding: 10px; border: 2px solid #667eea; border-radius: 20px; width: 250px; font-size: 14px;">
            <div id="searchResults" style="background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); margin-top: 5px; max-height: 300px; overflow-y: auto; display: none;"></div>
        </div>
    `;
    document.body.appendChild(searchContainer);
    
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchContent(query);
        displaySearchResults(results);
    });
    
    // إخفاء النتائج عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// البحث في المحتوى
function searchContent(query) {
    const results = [];
    const articles = document.querySelectorAll('article');
    
    articles.forEach(article => {
        const title = article.querySelector('h3')?.textContent || '';
        const content = article.textContent.toLowerCase();
        
        if (content.includes(query)) {
            results.push({
                title: title,
                id: article.id,
                snippet: getSnippet(article.textContent, query)
            });
        }
    });
    
    return results;
}

// استخراج مقطع من النص
function getSnippet(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    return '...' + text.substring(start, end) + '...';
}

// عرض نتائج البحث
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div style="padding: 15px; color: #666;">لم يتم العثور على نتائج</div>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <div style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;" 
                 onclick="scrollToElement('${result.id}')">
                <strong>${result.title}</strong><br>
                <small style="color: #666;">${result.snippet}</small>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

// الانتقال إلى عنصر معين
function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 3000);
    }
    document.getElementById('searchResults').style.display = 'none';
}

// مؤشر التقدم
function initializeProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// تبديل المظهر (فاتح/داكن) محسن
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(themeToggle);
    
    // تحميل المظهر المحفوظ
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // إضافة أنيميشن انتقال
        document.body.style.transition = 'all 0.5s ease';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تحديث أيقونة الزر مع أنيميشن
        themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
        setTimeout(() => {
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
        
        // إضافة تأثير بصري
        createThemeTransitionEffect();
    });
    
    // تأثير الهوفر
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1)';
        themeToggle.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1)';
        themeToggle.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
    });
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تأثير انتقال المظهر
function createThemeTransitionEffect() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // إظهار التأثير
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // إخفاء التأثير
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }, 300);
}

// أنيميشن التمرير
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    document.querySelectorAll('article, .sidebar-section').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// خلفية الجسيمات التفاعلية
function initializeParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: 0.6;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const particleColor = isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)';
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // إعادة تدوير الجسيمات
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // رسم الجسيمة
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// قائمة الهاتف المحمول
function initializeMobileMenu() {
    if (window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 20px;
            cursor: pointer;
            z-index: 1001;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
            menuToggle.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// تحميل تفضيلات المستخدم
function loadUserPreferences() {
    // تحميل المظهر المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // تحميل موقع التمرير المحفوظ
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedScrollPosition));
        }, 100);
    }
    
    // حفظ موقع التمرير عند المغادرة
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('scrollPosition', window.scrollY.toString());
    });
}

// تحسين أداء التمرير
let ticking = false;
function optimizeScrollPerformance() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // تحديث مؤشر التقدم
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
            
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', optimizeScrollPerformance);

// إضافة أنماط CSS للمظهر الداكن المحسن
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    /* تحسينات إضافية للمظهر الداكن */
    [data-theme="dark"] {
        color-scheme: dark;
    }
    
    [data-theme="dark"] body {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
    }
    
    [data-theme="dark"] .navbar {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        border-bottom: 1px solid #4a5568;
    }
    
    [data-theme="dark"] .sidebar {
        background: #2d3748;
        border-right: 1px solid #4a5568;
    }
    
    [data-theme="dark"] .content article {
        background: #2d3748;
        border-color: #4a5568;
    }
    
    [data-theme="dark"] .content pre {
        background: #1a202c;
        border: 1px solid #4a5568;
    }
    
    [data-theme="dark"] footer {
        background: #2d3748;
        border-top: 1px solid #4a5568;
    }
    
    /* أنيميشن محسن للعناصر */
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0;
        }
        to { 
            transform: translateX(0); 
            opacity: 1;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    /* تأثيرات الهوفر المحسنة */
    .content article:hover {
        animation: pulse 0.6s ease-in-out;
    }
    
    .try-btn:active {
        transform: scale(0.95);
    }
    
    /* تحسينات الأداء */
    * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    
    .sidebar,
    .content {
        contain: layout style paint;
    }
`;
document.head.appendChild(enhancedStyles);
