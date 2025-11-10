// محرر الكود التفاعلي بتصميم VS Code
let editor = null;
let currentLanguage = 'html';
let templates = {};

// تهيئة المحرر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    initializeTemplates();
    loadTemplate('html-basic');
    updateFileName();
    console.log('✅ تم تحميل محرر الكود بتصميم VS Code!');
});

// تهيئة محرر CodeMirror
function initializeEditor() {
    const textarea = document.getElementById('codeEditor');
    
    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'htmlmixed',
        theme: 'default',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: false,
        styleActiveLine: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "F11": function(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });

    // تحديث موقع المؤشر
    editor.on('cursorActivity', () => {
        const cursor = editor.getCursor();
        document.getElementById('lineNumber').textContent = cursor.line + 1;
        document.getElementById('columnNumber').textContent = cursor.ch + 1;
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تغيير اللغة
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });

    // تشغيل الكود
    document.getElementById('runBtn').addEventListener('click', () => {
        runCode();
    });

    // مسح الكود
    document.getElementById('clearBtn').addEventListener('click', () => {
        clearCode();
    });

    // حفظ الكود
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveCode();
    });

    // البحث
    document.getElementById('searchBtn').addEventListener('click', () => {
        toggleSearch();
    });

    // Command Palette
    document.getElementById('commandBtn').addEventListener('click', () => {
        toggleCommandPalette();
    });

    // تنسيق الكود
    document.getElementById('formatBtn').addEventListener('click', () => {
        formatCode();
    });

    // أزرار التحكم في Console
    document.getElementById('collapseBtn').addEventListener('click', () => {
        toggleConsole();
    });

    document.getElementById('clearOutputBtn').addEventListener('click', () => {
        clearOutput();
    });

    // إعداد السحب والإفلات
    setupDragAndDrop();

    // Minimap
    document.getElementById('minimapBtn').addEventListener('click', () => {
        toggleMinimap();
    });

    // Word Wrap
    document.getElementById('wrapBtn').addEventListener('click', () => {
        toggleWordWrap();
    });

    // تحريك Console
    setupResizeHandle();

    // القوالب
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const template = card.dataset.template;
            loadTemplate(template);
        });
    });

    // اختصارات لوحة المفاتيح
    setupKeyboardShortcuts();

    // Command Palette
    setupCommandPalette();
}

// تغيير اللغة
function switchLanguage(language) {
    currentLanguage = language;
    document.getElementById('currentLanguage').textContent = language.toUpperCase();
    document.getElementById('currentLanguage2').textContent = language.toUpperCase();
    
    const modes = {
        'html': 'htmlmixed',
        'css': 'css',
        'javascript': 'javascript',
        'python': 'python'
    };

    editor.setOption('mode', modes[language]);
    
    // تحديث عنوان النتيجة
    const outputTitles = {
        'html': 'PREVIEW',
        'css': 'PREVIEW',
        'javascript': 'CONSOLE',
        'python': 'OUTPUT'
    };
    
    document.getElementById('outputTitle').textContent = outputTitles[language];
    updateFileName();
}

// تحديث اسم الملف
function updateFileName() {
    const extensions = {
        'html': 'html',
        'css': 'css',
        'javascript': 'js',
        'python': 'py'
    };
    
    const fileName = `main.${extensions[currentLanguage]}`;
    document.getElementById('currentFileName').textContent = fileName;
    document.getElementById('currentFile').textContent = fileName;
}

// تشغيل الكود
function runCode() {
    const code = editor.getValue();
    const outputContent = document.getElementById('outputContent');
    const previewFrame = document.getElementById('previewFrame');
    
    // تحديث استخدام المحرر للشهادات
    if (window.certificateSystem) {
        window.certificateSystem.updateEditorUsage();
    }

    // إخفاء/إظهار العناصر حسب اللغة
    if (currentLanguage === 'html' || currentLanguage === 'css') {
        outputContent.style.display = 'none';
        previewFrame.style.display = 'block';
        runHTMLCSS(code);
    } else {
        outputContent.style.display = 'block';
        previewFrame.style.display = 'none';
        
        if (currentLanguage === 'javascript') {
            runJavaScript(code);
        } else if (currentLanguage === 'python') {
            runPython(code);
        }
    }

    // إضافة نقاط للمستخدم
    if (window.ProgressAPI) {
        window.ProgressAPI.awardXP(10, 'تشغيل الكود في المحرر');
    }
    
    showNotification('Code executed successfully! ⚡', 'success');
}

// تشغيل HTML/CSS
function runHTMLCSS(code) {
    const previewFrame = document.getElementById('previewFrame');
    let htmlContent = code;

    if (currentLanguage === 'css') {
        htmlContent = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <style>${code}</style>
            </head>
            <body>
                <h1>Sample Title</h1>
                <p class="highlight">This is a sample paragraph</p>
                <div class="container">
                    <div class="box">Box 1</div>
                    <div class="box">Box 2</div>
                    <div class="box">Box 3</div>
                </div>
                <button class="btn">Sample Button</button>
            </body>
            </html>
        `;
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
}

// تشغيل JavaScript
function runJavaScript(code) {
    const outputContent = document.getElementById('outputContent');
    outputContent.innerHTML = '';

    // إعادة تعريف console.log
    const originalLog = console.log;
    const logs = [];
    
    console.log = function(...args) {
        logs.push(args.join(' '));
        originalLog.apply(console, args);
    };

    try {
        // تشغيل الكود
        eval(code);
        
        if (logs.length > 0) {
            outputContent.innerHTML = logs.map(log => `<div>${log}</div>`).join('');
        } else {
            outputContent.innerHTML = '<div style="color: #73c991;">Code executed successfully with no output</div>';
        }
        document.getElementById('errorCount').textContent = '0';
    } catch (error) {
        outputContent.innerHTML = `<div style="color: #f48771;">Error: ${error.message}</div>`;
        document.getElementById('errorCount').textContent = '1';
    } finally {
        console.log = originalLog;
    }
}

// تشغيل Python (محاكاة)
function runPython(code) {
    const outputContent = document.getElementById('outputContent');
    
    outputContent.innerHTML = `
        <div style="color: #73c991;">Python Code:</div>
        <pre style="margin: 10px 0; padding: 10px; background: #2d2d30; border-radius: 3px; color: #cccccc;">${code}</pre>
        <div style="color: #ffcc02;">Note: Python execution requires a server. This is code preview only.</div>
        <div style="color: #569cd6; margin-top: 10px;">Tip: Use <a href="https://repl.it" target="_blank" style="color: #4fc3f7;">Repl.it</a> to run Python online</div>
    `;
}

// مسح الكود
function clearCode() {
    editor.setValue('');
    document.getElementById('outputContent').innerHTML = '';
    document.getElementById('previewFrame').src = '';
    document.getElementById('errorCount').textContent = '0';
    showNotification('Code cleared 🗑️', 'info');
}

// حفظ الكود
function saveCode() {
    const code = editor.getValue();
    const savedCode = JSON.parse(localStorage.getItem('codeEditor_savedCode') || '{}');
    savedCode[currentLanguage] = code;
    localStorage.setItem('codeEditor_savedCode', JSON.stringify(savedCode));
    
    showNotification('Code saved successfully! 💾', 'success');
    
    if (window.ProgressAPI) {
        window.ProgressAPI.awardXP(5, 'حفظ الكود');
    }
}

// تهيئة القوالب
function initializeTemplates() {
    templates = {
        'html-basic': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello World! 🌍</h1>
    <p>This is a basic HTML page.</p>
    <button onclick="alert('Hello!')">Click Me</button>
    
    <div style="margin-top: 20px;">
        <h2>Todo List:</h2>
        <ul>
            <li>Learn HTML</li>
            <li>Learn CSS</li>
            <li>Learn JavaScript</li>
        </ul>
    </div>
</body>
</html>`,
        
        'css-flexbox': `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 10px;
    margin: 20px 0;
}

.box {
    background: white;
    padding: 20px;
    margin: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    text-align: center;
    font-weight: bold;
}

.box:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
}

.btn {
    background: #4CAF50;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    margin: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.btn:hover {
    background: #45a049;
    transform: scale(1.05);
}

.highlight {
    background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
}`,
        
        'js-function': `// Welcome function
function sayHello(name) {
    return "Hello " + name + "! 👋";
}

// Call the function
console.log(sayHello("Ahmed"));

// Array of names
const names = ["Fatima", "Mohammed", "Aisha", "Ali"];

// Print each name
console.log("\\n=== Name List ===");
names.forEach((name, index) => {
    console.log(\`\${index + 1}. \${sayHello(name)}\`);
});

// Calculate sum
function sum(a, b) {
    return a + b;
}

console.log("\\n=== Math Operations ===");
console.log("Sum:", sum(15, 25));

// Simple object
const student = {
    name: "Sara",
    age: 22,
    grade: "A+",
    subjects: ["Math", "Physics", "Chemistry"]
};

console.log("\\n=== Student Info ===");
console.log(\`Name: \${student.name}\`);
console.log(\`Age: \${student.age}\`);
console.log(\`Grade: \${student.grade}\`);
console.log("Subjects:", student.subjects.join(", "));`,
        
        'python-basic': `# Basic Python program
def say_hello(name):
    return f"Hello {name}! 👋"

# List of names
names = ["Ahmed", "Fatima", "Mohammed", "Ali"]

# Print greeting for each name
print("=== Name List ===")
for i, name in enumerate(names, 1):
    print(f"{i}. {say_hello(name)}")

# Calculate sum
def add_numbers(a, b):
    return a + b

print("\\n=== Math Operations ===")
result = add_numbers(20, 15)
print(f"Sum: {result}")

# Simple dictionary
student = {
    "name": "Sara",
    "age": 22,
    "grade": "A+",
    "subjects": ["Math", "Physics", "Chemistry"]
}

print("\\n=== Student Info ===")
print(f"Name: {student['name']}")
print(f"Age: {student['age']}")
print(f"Grade: {student['grade']}")
print(f"Subjects: {', '.join(student['subjects'])}")

# Simple loop
print("\\n=== Numbers 1 to 5 ===")
for num in range(1, 6):
    print(f"Number: {num}")
`
    };
}

// تحميل قالب
function loadTemplate(templateName) {
    if (templates[templateName]) {
        editor.setValue(templates[templateName]);
        
        // تغيير اللغة حسب القالب
        const languageMap = {
            'html-basic': 'html',
            'css-flexbox': 'css',
            'js-function': 'javascript',
            'python-basic': 'python'
        };
        
        if (languageMap[templateName]) {
            document.getElementById('languageSelect').value = languageMap[templateName];
            switchLanguage(languageMap[templateName]);
        }
        
        showNotification(`Template ${templateName} loaded 📄`, 'success');
        
        if (window.ProgressAPI) {
            window.ProgressAPI.awardXP(3, 'تحميل قالب كود');
        }
    }
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        padding: 12px 16px;
        background: ${type === 'success' ? '#16825d' : type === 'error' ? '#a1260d' : '#0e639c'};
        color: white;
        border-radius: 3px;
        z-index: 10000;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// === المميزات الجديدة ===

// إعداد السحب والإفلات للـ Console
function setupDragAndDrop() {
    const panelHeader = document.getElementById('outputPanelHeader');
    const outputPanel = document.getElementById('outputPanel');
    const workspace = document.getElementById('editorWorkspace');
    
    let isDragging = false;
    let dragPreview = null;
    let startX, startY;
    
    panelHeader.addEventListener('mousedown', (e) => {
        // تجاهل النقر على الأزرار
        if (e.target.classList.contains('panel-btn')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        panelHeader.classList.add('dragging');
        
        // إنشاء معاينة السحب
        createDragPreview(e.clientX, e.clientY);
        
        // إظهار مناطق الإسقاط
        showDropZones();
        
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        
        e.preventDefault();
    });
    
    function createDragPreview(x, y) {
        dragPreview = document.createElement('div');
        dragPreview.className = 'drag-preview';
        dragPreview.textContent = '📱 Console Panel';
        dragPreview.style.left = x + 10 + 'px';
        dragPreview.style.top = y + 10 + 'px';
        document.body.appendChild(dragPreview);
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        
        // تحديث موقع معاينة السحب
        if (dragPreview) {
            dragPreview.style.left = e.clientX + 10 + 'px';
            dragPreview.style.top = e.clientY + 10 + 'px';
        }
        
        // تحديد منطقة الإسقاط النشطة
        updateActiveDropZone(e.clientX, e.clientY);
    }
    
    function handleDragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        panelHeader.classList.remove('dragging');
        
        // إزالة معاينة السحب
        if (dragPreview) {
            dragPreview.remove();
            dragPreview = null;
        }
        
        // تحديد موقع الإسقاط وتطبيقه
        const dropZone = getActiveDropZone(e.clientX, e.clientY);
        if (dropZone) {
            applyPanelPosition(dropZone);
        }
        
        // إخفاء مناطق الإسقاط
        hideDropZones();
        
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }
    
    function showDropZones() {
        document.getElementById('dropZoneRight').classList.add('active');
        document.getElementById('dropZoneBottom').classList.add('active');
        document.getElementById('dropZoneCenter').classList.add('active');
    }
    
    function hideDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('active');
        });
    }
    
    function updateActiveDropZone(x, y) {
        const workspaceRect = workspace.getBoundingClientRect();
        const relativeX = x - workspaceRect.left;
        const relativeY = y - workspaceRect.top;
        
        // إزالة التمييز من جميع المناطق
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.style.background = 'rgba(0, 122, 204, 0.2)';
        });
        
        // تمييز المنطقة النشطة
        const activeZone = getActiveDropZone(x, y);
        if (activeZone) {
            activeZone.style.background = 'rgba(0, 122, 204, 0.4)';
        }
    }
    
    function getActiveDropZone(x, y) {
        const workspaceRect = workspace.getBoundingClientRect();
        const relativeX = x - workspaceRect.left;
        const relativeY = y - workspaceRect.top;
        
        // منطقة اليمين
        if (relativeX > workspaceRect.width * 0.5) {
            return document.getElementById('dropZoneRight');
        }
        
        // منطقة الأسفل
        if (relativeY > workspaceRect.height * 0.5) {
            return document.getElementById('dropZoneBottom');
        }
        
        // المنطقة المركزية (إخفاء)
        if (relativeX > workspaceRect.width * 0.25 && 
            relativeX < workspaceRect.width * 0.75 &&
            relativeY > workspaceRect.height * 0.25 && 
            relativeY < workspaceRect.height * 0.75) {
            return document.getElementById('dropZoneCenter');
        }
        
        return null;
    }
    
    function applyPanelPosition(dropZone) {
        const panel = document.getElementById('outputPanel');
        
        if (dropZone.id === 'dropZoneRight') {
            // نقل لليمين
            panel.classList.remove('bottom', 'collapsed');
            workspace.style.flexDirection = 'row';
            showNotification('Console moved to right! ➡️', 'success');
            
        } else if (dropZone.id === 'dropZoneBottom') {
            // نقل للأسفل
            panel.classList.remove('collapsed');
            panel.classList.add('bottom');
            workspace.style.flexDirection = 'column';
            showNotification('Console moved to bottom! ⬇️', 'success');
            
        } else if (dropZone.id === 'dropZoneCenter') {
            // إخفاء
            panel.classList.add('collapsed');
            showNotification('Console hidden! 👁️', 'info');
        }
    }
}

// تبديل شريط البحث
function toggleSearch() {
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBox.classList.contains('show')) {
        searchBox.classList.remove('show');
    } else {
        searchBox.classList.add('show');
        searchInput.focus();
        searchInput.addEventListener('input', performSearch);
    }
}

// البحث في الكود
function performSearch() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('searchResults');
    
    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const code = editor.getValue();
    const lines = code.split('\n');
    const results = [];
    
    lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                line: index + 1,
                content: line.trim(),
                index: index
            });
        }
    });
    
    resultsDiv.innerHTML = results.map(result => 
        `<div class="search-result" onclick="goToLine(${result.index})">
            Line ${result.line}: ${result.content}
        </div>`
    ).join('');
}

// الانتقال إلى سطر معين
function goToLine(lineIndex) {
    editor.setCursor(lineIndex, 0);
    editor.focus();
    document.getElementById('searchBox').classList.remove('show');
}

// تبديل Command Palette
function toggleCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');
    
    if (palette.classList.contains('show')) {
        palette.classList.remove('show');
    } else {
        palette.classList.add('show');
        input.focus();
    }
}

// إعداد Command Palette
function setupCommandPalette() {
    const input = document.getElementById('commandInput');
    const list = document.getElementById('commandList');
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = list.querySelectorAll('.command-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    });
    
    list.addEventListener('click', (e) => {
        const item = e.target.closest('.command-item');
        if (item) {
            executeCommand(item.dataset.command);
            toggleCommandPalette();
        }
    });
}

// تنفيذ الأوامر
function executeCommand(command) {
    switch (command) {
        case 'run':
            runCode();
            break;
        case 'save':
            saveCode();
            break;
        case 'format':
            formatCode();
            break;
        case 'search':
            toggleSearch();
            break;
        case 'clear':
            clearCode();
            break;
        case 'toggle-wrap':
            toggleWordWrap();
            break;
        case 'toggle-minimap':
            toggleMinimap();
            break;
        case 'move-console':
            toggleConsolePosition();
            break;
    }
}

// تنسيق الكود
function formatCode() {
    const code = editor.getValue();
    let formattedCode = code;
    
    if (currentLanguage === 'html') {
        // تنسيق HTML بسيط
        formattedCode = code.replace(/></g, '>\n<');
    } else if (currentLanguage === 'css') {
        // تنسيق CSS بسيط
        formattedCode = code.replace(/;/g, ';\n').replace(/{/g, ' {\n').replace(/}/g, '\n}\n');
    } else if (currentLanguage === 'javascript') {
        // تنسيق JavaScript بسيط
        formattedCode = code.replace(/;/g, ';\n').replace(/{/g, ' {\n').replace(/}/g, '\n}\n');
    }
    
    editor.setValue(formattedCode);
    showNotification('Code formatted! 📐', 'success');
}

// تبديل Console
function toggleConsole() {
    const panel = document.getElementById('outputPanel');
    panel.classList.toggle('collapsed');
    
    const btn = document.getElementById('collapseBtn');
    btn.textContent = panel.classList.contains('collapsed') ? '📂' : '❌';
    btn.title = panel.classList.contains('collapsed') ? 'Show Panel' : 'Collapse Panel';
}

// تبديل موقع Console (للاختصار)
function toggleConsolePosition() {
    const panel = document.getElementById('outputPanel');
    const workspace = document.querySelector('.editor-workspace');
    
    if (panel.classList.contains('bottom')) {
        // العودة لليمين
        panel.classList.remove('bottom');
        workspace.style.flexDirection = 'row';
        showNotification('Console moved to right! ➡️', 'success');
    } else if (panel.classList.contains('collapsed')) {
        // إظهار في اليمين
        panel.classList.remove('collapsed');
        workspace.style.flexDirection = 'row';
        showNotification('Console shown on right! 👁️', 'success');
    } else {
        // نقل للأسفل
        panel.classList.add('bottom');
        workspace.style.flexDirection = 'column';
        showNotification('Console moved to bottom! ⬇️', 'success');
    }
}

// مسح الإخراج
function clearOutput() {
    document.getElementById('outputContent').innerHTML = '';
    document.getElementById('previewFrame').src = '';
    showNotification('Output cleared! 🗑️', 'info');
}

// تبديل Minimap
function toggleMinimap() {
    const minimap = document.getElementById('minimap');
    const btn = document.getElementById('minimapBtn');
    
    if (minimap.style.display === 'none') {
        minimap.style.display = 'block';
        btn.classList.add('active');
        updateMinimap();
    } else {
        minimap.style.display = 'none';
        btn.classList.remove('active');
    }
}

// تحديث Minimap
function updateMinimap() {
    const minimap = document.getElementById('minimapContent');
    const code = editor.getValue();
    minimap.textContent = code;
}

// تبديل Word Wrap
function toggleWordWrap() {
    const currentWrap = editor.getOption('lineWrapping');
    editor.setOption('lineWrapping', !currentWrap);
    
    const btn = document.getElementById('wrapBtn');
    btn.classList.toggle('active');
    
    showNotification(`Word wrap ${!currentWrap ? 'enabled' : 'disabled'}! 📄`, 'info');
}

// إعداد تحريك Console
function setupResizeHandle() {
    const handle = document.getElementById('resizeHandle');
    const panel = document.getElementById('outputPanel');
    let isResizing = false;
    
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
    
    function resize(e) {
        if (!isResizing) return;
        
        const containerRect = document.querySelector('.editor-workspace').getBoundingClientRect();
        const newWidth = containerRect.right - e.clientX;
        
        if (newWidth > 200 && newWidth < containerRect.width - 200) {
            panel.style.width = newWidth + 'px';
        }
    }
    
    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// اختصارات لوحة المفاتيح
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+F للبحث
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            toggleSearch();
        }
        
        // Ctrl+Shift+P للـ Command Palette
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            toggleCommandPalette();
        }
        
        // F5 لتشغيل الكود
        if (e.key === 'F5') {
            e.preventDefault();
            runCode();
        }
        
        // Ctrl+S للحفظ
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCode();
        }
        
        // Shift+Alt+F للتنسيق
        if (e.shiftKey && e.altKey && e.key === 'F') {
            e.preventDefault();
            formatCode();
        }
        
        // Ctrl+K للمسح
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            clearCode();
        }
        
        // Alt+Z لـ Word Wrap
        if (e.altKey && e.key === 'z') {
            e.preventDefault();
            toggleWordWrap();
        }
        
        // Ctrl+M للـ Minimap
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleMinimap();
        }
        
        // Ctrl+` لتبديل موقع Console
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleConsolePosition();
        }
        
        // Escape لإغلاق النوافذ
        if (e.key === 'Escape') {
            document.getElementById('searchBox').classList.remove('show');
            document.getElementById('commandPalette').classList.remove('show');
        }
    });
}