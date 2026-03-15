const state = {
    lang: localStorage.getItem('wag_lang') || 'ru',
    theme: localStorage.getItem('wag_theme') || 'light',
    chatHistory: JSON.parse(localStorage.getItem('wag_chat_history')) || []
};

const translations = {
    ru: { nav1: "Главная", nav2: "История", nav3: "Состав", nav4: "Чат", nav5: "Войти", title: "Это <span class='accent-text'>форум</span> по WAG", description: "Узнавайте новое о WAG Group, делитесь проблемами и находите решения вместе.", btn: "Начать общение", chatTitle: "Чат WAG", chatPlaceholder: "Сообщение...", clearBtn: "Очистить", authTitle: "Вход", themeBtn: "Темная" },
    en: { nav1: "Home", nav2: "History", nav3: "Structure", nav4: "Chat", nav5: "Login", title: "This is <span class='accent-text'>WAG forum</span>", description: "Learn about WAG Group together.", btn: "Get Started", chatTitle: "WAG Chat", chatPlaceholder: "Message...", clearBtn: "Clear", authTitle: "Login", themeBtn: "Dark" }
};

// ЗАГРУЗКА
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('loaded');
        document.body.classList.add('loaded-content');
    }, 1500);
});

// ИНТЕРФЕЙС
window.setLanguage = (lang) => {
    const content = document.querySelector('.content');
    content.classList.add('fade-out');
    setTimeout(() => {
        state.lang = lang;
        localStorage.setItem('wag_lang', lang);
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');
        updateUI();
        content.classList.remove('fade-out');
    }, 300);
};

function updateUI() {
    const d = translations[state.lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (el.tagName === 'INPUT') el.placeholder = d[key];
        else if (key === 'themeBtn') {
            el.querySelector('.text').innerText = state.theme === 'light' ? d.themeBtn : (state.lang === 'ru' ? 'Светлая' : 'Light');
            el.querySelector('.icon').innerText = state.theme === 'light' ? '🌙' : '☀️';
        }
        else el.innerHTML = d[key];
    });
}

window.toggleTheme = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('wag_theme', state.theme);
    updateUI();
};

// ОКНА
window.openChat = () => { document.getElementById('chatModal').style.display = 'flex'; renderChat(); };
window.closeChat = () => document.getElementById('chatModal').style.display = 'none';
window.openAuth = () => document.getElementById('authModal').style.display = 'flex';
window.closeAuth = () => document.getElementById('authModal').style.display = 'none';
window.openTeam = () => document.getElementById('teamModal').style.display = 'flex';
window.closeTeam = () => document.getElementById('teamModal').style.display = 'none';

// ЭКРАН ПЕРЕХОДА ПРИ КЛИКЕ НА ЛОГО
window.goToWagSite = () => {
    const overlay = document.getElementById('fadeOverlay');
    overlay.classList.add('fade-active');
    setTimeout(() => {
        window.open("https://www.volkswagen-group.com", "_blank");
        setTimeout(() => overlay.classList.remove('fade-active'), 1000);
    }, 1500);
};

// ЧАТ
window.sendMessage = () => {
    const input = document.getElementById('chatInput');
    if (!input.value.trim()) return;
    state.chatHistory.push({ text: input.value, type: 'out' });
    input.value = ''; renderChat();
    setTimeout(() => {
        state.chatHistory.push({ text: state.lang === 'ru' ? "Интересно!" : "Interesting!", type: 'in' });
        renderChat();
    }, 1000);
};

function renderChat() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    state.chatHistory.forEach(m => {
        const div = document.createElement('div');
        div.className = `message msg-${m.type}`; div.textContent = m.text;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

window.clearChatHistory = () => { state.chatHistory = []; renderChat(); };

// ФОН CANVAS
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
function initBg() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    dots = [];
    for(let i=0; i<80; i++) dots.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4 });
}
function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if(d.x<0 || d.x>canvas.width) d.vx *= -1;
        if(d.y<0 || d.y>canvas.height) d.vy *= -1;
        ctx.fillStyle = '#2088FA'; ctx.beginPath(); ctx.arc(d.x, d.y, 1.5, 0, Math.PI*2); ctx.fill();
        if (Math.sqrt((d.x-mouse.x)**2 + (d.y-mouse.y)**2) < 150) {
            ctx.strokeStyle = 'rgba(32, 136, 250, 0.2)'; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
    });
    requestAnimationFrame(animate);
}
window.addEventListener('resize', initBg);
initBg(); animate(); updateUI();
document.getElementById(`lang-${state.lang}`).classList.add('active');
document.documentElement.setAttribute('data-theme', state.theme);
