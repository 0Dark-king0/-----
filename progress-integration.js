// سكريبت دمج نظام التقدم مع الدروس والألعاب
(function() {
    'use strict';
    
    // تحميل نظام التقدم إذا لم يكن موجوداً
    function loadProgressSystem() {
        if (typeof window.ProgressAPI === 'undefined') {
            // محاكاة نظام التقدم محلياً
            window.ProgressAPI = {
                addXP: function(amount, source) {
                    console.log(`+${amount} XP من ${source}`);
                    
                    // تحديث نظام الشهادات إذا كان متاحاً
                    if (window.certificateSystem) {
                        window.certificateSystem.updateXP(amount, source);
                    }
                    
                    showXPNotification(amount, source);
                },
                completeLesson: function() {
                    this.addXP(20, 'إكمال درس');
                },
                completeGame: function(score) {
                    this.addXP(30 + Math.floor(score / 10), 'إكمال لعبة');
                },
                foundBug: function() {
                    this.addXP(5, 'اكتشاف خطأ');
                },
                perfectGame: function() {
                    this.addXP(50, 'لعبة مثالية');
                },
                recordTime: function(time) {
                    this.addXP(25, 'رقم قياسي جديد');
                },
                saveProgress: function() {
                    // حفظ التقدم في الذاكرة المحلية
                    localStorage.setItem('progress', JSON.stringify(window.ProgressAPI));
                },
                showNotification: function(message, type) {
                    // إنشاء عنصر الإشعار
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        padding: 15px 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 10000;
                        font-family: Arial, sans-serif;
                        font-weight: bold;
                        transform: translateX(100%);
                        transition: transform 0.3s ease;
                    `;
                    notification.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.2rem;">🎉</span>
                            <div>
                                <div>${message}</div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(notification);
                    
                    // تأثير الظهور
                    setTimeout(() => {
                        notification.style.transform = 'translateX(0)';
                    }, 100);
                    
                    // إخفاء الإشعار بعد 3 ثوان
                    setTimeout(() => {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }, 3000);
                }
            };
        }
    }
    
    // إظهار إشعار النقاط
    function showXPNotification(amount, source) {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">🎉</span>
                <div>
                    <div>+${amount} نقطة خبرة</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">${source}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // تأثير الظهور
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // إخفاء الإشعار بعد 3 ثوان
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // إضافة أزرار إكمال الدرس للصفحات
    function addLessonCompletionButton() {
        // التحقق من وجود محتوى درس
        const lessonContent = document.querySelector('.content, .lesson-container, article');
        if (lessonContent && window.location.pathname.includes('/lessons/')) {
            
            // التحقق من عدم وجود الزر مسبقاً
            if (document.getElementById('complete-lesson-btn')) {
                return;
            }
            
            const completionSection = document.createElement('div');
            completionSection.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
                border: 2px solid #4CAF50;
            `;
            
            completionSection.innerHTML = `
                <h3 style="color: #4CAF50; margin-bottom: 15px;">🎓 إكمال الدرس</h3>
                <p style="color: #666; margin-bottom: 20px;">هل أكملت هذا الدرس وفهمت المحتوى؟</p>
                <button id="complete-lesson-btn" style="
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 25px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" 
                   onmouseout="this.style.transform='translateY(0)'">
                    ✅ أكملت الدرس (+20 نقطة)
                </button>
            `;
            
            lessonContent.appendChild(completionSection);
            
            // إضافة وظيفة الزر
            document.getElementById('complete-lesson-btn').addEventListener('click', function() {
                window.ProgressAPI.completeLesson();
                this.disabled = true;
                this.innerHTML = '✅ تم إكمال الدرس';
                this.style.opacity = '0.7';
                this.style.cursor = 'not-allowed';
                
                // حفظ حالة إكمال الدرس
                const lessonId = window.location.pathname;
                localStorage.setItem(`lesson-completed-${lessonId}`, 'true');
            });
            
            // التحقق من إكمال الدرس مسبقاً
            const lessonId = window.location.pathname;
            if (localStorage.getItem(`lesson-completed-${lessonId}`) === 'true') {
                const btn = document.getElementById('complete-lesson-btn');
                btn.disabled = true;
                btn.innerHTML = '✅ تم إكمال الدرس';
                btn.style.opacity = '0.7';
                btn.style.cursor = 'not-allowed';
            }
        }
    }
    
    // إضافة رابط نظام التقدم لجميع الصفحات
    function addProgressLink() {
        // البحث عن شريط التنقل أو الهيدر
        const nav = document.querySelector('nav, .navbar, header');
        if (nav && !document.getElementById('progress-link')) {
            const progressLink = document.createElement('a');
            progressLink.id = 'progress-link';
            progressLink.href = '/progress/index.html';
            progressLink.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 12px 16px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            progressLink.innerHTML = '📊 نقاطي';
            
            progressLink.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            });
            
            progressLink.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            });
            
            document.body.appendChild(progressLink);
        }
    }
    
    // تحسين أزرار "جرب الكود" لإعطاء نقاط
    function enhanceTryCodeButtons() {
        const tryButtons = document.querySelectorAll('.try-btn');
        tryButtons.forEach(button => {
            if (!button.dataset.enhanced) {
                button.dataset.enhanced = 'true';
                const originalClick = button.onclick;
                
                button.addEventListener('click', function() {
                    // تنفيذ الوظيفة الأصلية
                    if (originalClick) {
                        originalClick.call(this);
                    }
                    
                    // إعطاء نقاط لتجربة الكود
                    setTimeout(() => {
                        window.ProgressAPI.addXP(2, 'تجربة كود');
                    }, 500);
                });
            }
        });
    }
    
    // تحسين أزرار النسخ لإعطاء نقاط
    function enhanceCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn, [onclick*="copy"]');
        copyButtons.forEach(button => {
            if (!button.dataset.enhanced) {
                button.dataset.enhanced = 'true';
                
                button.addEventListener('click', function() {
                    setTimeout(() => {
                        window.ProgressAPI.addXP(1, 'نسخ كود');
                    }, 100);
                });
            }
        });
    }
    
    // بدء النظام
    function init() {
        loadProgressSystem();
        addLessonCompletionButton();
        addProgressLink();
        enhanceTryCodeButtons();
        enhanceCopyButtons();
        
        // إعادة فحص العناصر الجديدة كل ثانيتين
        setInterval(() => {
            enhanceTryCodeButtons();
            enhanceCopyButtons();
        }, 2000);
    }
    
    // تشغيل النظام عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // تصدير الوظائف للاستخدام الخارجي
    window.ProgressIntegration = {
        showXPNotification: showXPNotification,
        addLessonCompletionButton: addLessonCompletionButton,
        enhanceTryCodeButtons: enhanceTryCodeButtons
    };
})();
