function switchTab(tabName, btnElement) {
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const section = document.getElementById(tabName);
    if (section) section.classList.add('active');

    if (btnElement) btnElement.classList.add('active');

    localStorage.setItem('current-tab', tabName);
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.settings-section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const savedTab = localStorage.getItem('current-tab') || 'themes';
    const section = document.getElementById(savedTab);
    if (section) section.classList.add('active');
    const btn = Array.from(document.querySelectorAll('.tab-btn'))
        .find(b => b.getAttribute('onclick')?.includes(savedTab));
    if (btn) btn.classList.add('active');
    
    applySavedCloak();
    applyTheme();
    applyBackground();
});


const premadeThemes = {
    "default": {
        css: `:root {
            --bg-secondary: #0a0014;
            --bg-tertiary: #1a0a2e;
            --text-secondary: #ff66ff;
            --accent: #dd00ff;
            --accent-hover: #ff33ff;
            --border: rgba(255, 102, 255, 0.2);
            --accent-secondary: #ff33ff;
            --modal-overlay: rgba(10, 0, 20, 0.95);
            --shadow-heavy: rgba(221, 0, 255, 0.5);
            --bg-card: rgba(26, 10, 46, 0.6);
            --accent-primary: #ff66ff;
            --text-muted: #ff66ff;
            --text-dim: rgba(255, 102, 255, 0.5);
            --border-color: rgba(255, 102, 255, 0.4);
            --border-glow: rgba(255, 102, 255, 0.3);
            --input-bg: rgba(26, 10, 46, 0.3);
            --input-bg-focus: rgba(26, 10, 46, 0.5);
            --btn-bg: rgba(221, 0, 255, 0.2);
            --btn-hover-bg: rgba(255, 102, 255, 0.3);
            --tab-active-bg: rgba(221, 0, 255, 0.3);
            --tab-active-shadow: 0 0 20px rgba(221, 0, 255, 0.5);
            --primary: #dd00ff;
            --secondary: #ff33ff;
            --glow: rgba(221, 0, 255, 0.45);
        }
        .home-title { color: #ff66ff !important; }
        .tab-add-btn { background: rgba(221, 0, 255, 0.2) !important; }
        .tab-add-btn:hover { background: rgba(255, 102, 255, 0.3) !important; }
        #uv-address:focus { border-color: #ff66ff !important; }
        .add-shortcut-btn:hover { border-color: #ff66ff !important; color: #ff66ff !important; }`,
        background: '/images/back.png'
    },
    
    "pink-spheres": {
        css: `:root {
            --bg-secondary: #1a0520;
            --bg-tertiary: #2d0a3a;
            --text-secondary: #ff99ff;
            --accent: #e642ff;
            --accent-hover: #ff66ff;
            --border: rgba(255, 102, 255, 0.25);
            --accent-secondary: #ff66ff;
            --modal-overlay: rgba(26, 5, 32, 0.95);
            --shadow-heavy: rgba(230, 66, 255, 0.5);
            --bg-card: rgba(45, 10, 58, 0.6);
            --accent-primary: #ff99ff;
            --text-muted: #ff99ff;
            --text-dim: rgba(255, 153, 255, 0.5);
            --border-color: rgba(255, 102, 255, 0.4);
            --border-glow: rgba(255, 102, 255, 0.3);
            --input-bg: rgba(45, 10, 58, 0.3);
            --input-bg-focus: rgba(45, 10, 58, 0.5);
            --btn-bg: rgba(230, 66, 255, 0.2);
            --btn-hover-bg: rgba(255, 102, 255, 0.3);
            --tab-active-bg: rgba(230, 66, 255, 0.3);
            --tab-active-shadow: 0 0 20px rgba(230, 66, 255, 0.5);
            --primary: #e642ff;
            --secondary: #ff66ff;
            --glow: rgba(230, 66, 255, 0.45);
        }
        .home-title { color: #ff99ff !important; }
        .tab-add-btn { background: rgba(230, 66, 255, 0.2) !important; }
        .tab-add-btn:hover { background: rgba(255, 102, 255, 0.3) !important; }
        #uv-address:focus { border-color: #ff99ff !important; }
        .add-shortcut-btn:hover { border-color: #ff99ff !important; color: #ff99ff !important; }`,
        background: '/images/back2.jpg'  
    },
    
    "purple-glow": {
        css: `:root {
            --bg-secondary: #1a0a2e;
            --bg-tertiary: #2d1548;
            --text-secondary: #d88fff;
            --accent: #c44fff;
            --accent-hover: #d88fff;
            --border: rgba(216, 143, 255, 0.25);
            --accent-secondary: #d88fff;
            --modal-overlay: rgba(26, 10, 46, 0.95);
            --shadow-heavy: rgba(196, 79, 255, 0.5);
            --bg-card: rgba(45, 21, 72, 0.6);
            --accent-primary: #d88fff;
            --text-muted: #d88fff;
            --text-dim: rgba(216, 143, 255, 0.5);
            --border-color: rgba(216, 143, 255, 0.4);
            --border-glow: rgba(216, 143, 255, 0.3);
            --input-bg: rgba(45, 21, 72, 0.3);
            --input-bg-focus: rgba(45, 21, 72, 0.5);
            --btn-bg: rgba(196, 79, 255, 0.2);
            --btn-hover-bg: rgba(216, 143, 255, 0.3);
            --tab-active-bg: rgba(196, 79, 255, 0.3);
            --tab-active-shadow: 0 0 20px rgba(196, 79, 255, 0.5);
            --primary: #c44fff;
            --secondary: #d88fff;
            --glow: rgba(196, 79, 255, 0.45);
        }
        .home-title { color: #d88fff !important; }
        .tab-add-btn { background: rgba(196, 79, 255, 0.2) !important; }
        .tab-add-btn:hover { background: rgba(216, 143, 255, 0.3) !important; }
        #uv-address:focus { border-color: #d88fff !important; }
        .add-shortcut-btn:hover { border-color: #d88fff !important; color: #d88fff !important; }`,
        background: '/images/back3.png'  
    }
};

const themeParticleColors = {
    'default': ['#b026d3', '#d946ef', '#a855f7'],
    'pink-spheres': ['#e642ff', '#ff66ff', '#ff99ff'],
    'purple-glow': ['#c44fff', '#d88fff', '#a855f7']
};

function broadcastThemeChange(themeName) {
    const event = new CustomEvent('themeChange', {
        detail: { theme: themeName }
    });
    window.dispatchEvent(event);
    
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('theme_channel');
        channel.postMessage({ type: 'themeChange', theme: themeName });
        channel.close();
    }
    
    localStorage.setItem('theme-change-event', JSON.stringify({
        theme: themeName,
        timestamp: Date.now()
    }));
}

function applyTheme() {
    const currentThemeName = localStorage.getItem('current-theme-name');
    
    
    if (!currentThemeName || currentThemeName === 'default') {
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        styleElement.textContent = premadeThemes.default.css;
        document.head.appendChild(styleElement);
        return;
    }
    
  
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        styleElement.textContent = savedTheme;
        document.head.appendChild(styleElement);
    }
}

function applyBackground() {
    const currentThemeName = localStorage.getItem('current-theme-name');
    const backgroundEl = document.querySelector('.custom-background');
    
    if (!backgroundEl) return;
    
   
    if (!currentThemeName || currentThemeName === 'default') {
        backgroundEl.style.backgroundImage = `url('${premadeThemes.default.background}')`;
        return;
    }
    
 
    const customImg = localStorage.getItem('custom-img');
    if (customImg) {
        backgroundEl.style.backgroundImage = `url('${customImg}')`;
        return;
    }
    

    const savedBackground = localStorage.getItem('theme-background');
    if (savedBackground) {
        backgroundEl.style.backgroundImage = `url('${savedBackground}')`;
    } else {
     
        backgroundEl.style.backgroundImage = `url('${premadeThemes.default.background}')`;
    }
}

function clearTheme() {
    localStorage.removeItem('theme');
    localStorage.removeItem('current-theme-name');
    localStorage.removeItem('theme-background');
    localStorage.removeItem('custom-img');
    
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) existingStyle.remove();
    
   
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-theme-style';
    styleElement.textContent = premadeThemes.default.css;
    document.head.appendChild(styleElement);
    
    const backgroundEl = document.querySelector('.custom-background');
    if (backgroundEl) {
        backgroundEl.style.backgroundImage = `url('${premadeThemes.default.background}')`;
    }
    
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        pJSDom[0].pJS.particles.color.value = themeParticleColors.default;
        pJSDom[0].pJS.particles.line_linked.color = themeParticleColors.default[0];
        pJSDom[0].pJS.fn.particlesRefresh();
    }

    if (typeof window.applyGlobalTheme === 'function') {
        window.applyGlobalTheme('default');
    }
    
    broadcastThemeChange('default');
    
    alert('Theme cleared! Default theme applied.');
}

function setTheme(theme) {
    if (!premadeThemes[theme]) {
        alert('Theme not found!');
        return;
    }
    
    localStorage.setItem('theme', premadeThemes[theme].css);
    localStorage.setItem('current-theme-name', theme);
    localStorage.setItem('theme-background', premadeThemes[theme].background);
    localStorage.removeItem('custom-img');
    
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) existingStyle.remove();
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-theme-style';
    styleElement.textContent = premadeThemes[theme].css;
    document.head.appendChild(styleElement);
    
    const backgroundEl = document.querySelector('.custom-background');
    if (backgroundEl) {
        backgroundEl.style.backgroundImage = `url('${premadeThemes[theme].background}')`;
    }
    
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        if (themeParticleColors[theme]) {
            pJSDom[0].pJS.particles.color.value = themeParticleColors[theme];
            pJSDom[0].pJS.particles.line_linked.color = themeParticleColors[theme][0];
            pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    if (typeof window.applyGlobalTheme === 'function') {
        window.applyGlobalTheme(theme);
    }
    
    broadcastThemeChange(theme);
    
    alert(`${theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ')} theme applied!`);
}

function loadCustomTheme() {
    const themeValue = document.getElementById('themebox').value;
    if (themeValue) {
        localStorage.setItem('theme', themeValue);
        localStorage.setItem('current-theme-name', 'custom');
        
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        styleElement.textContent = themeValue;
        document.head.appendChild(styleElement);
        
        broadcastThemeChange('custom');
        
        alert('Custom theme applied!');
    }
}

function setCustomImage() {
    const imageUrl = prompt('Enter the URL of your custom image:');
    if (imageUrl) {
        localStorage.setItem('custom-img', imageUrl);
        localStorage.setItem('current-theme-name', 'custom'); 
        
        const backgroundEl = document.querySelector('.custom-background');
        if (backgroundEl) {
            backgroundEl.style.backgroundImage = `url('${imageUrl}')`;
        }
        
        alert('Custom image set! It will appear on all pages.');
    }
}

const ORIGINAL_FAVICON = "/images/sat4.png";

function applyTabCloak(title, favicon) {
    const doc = window.top.document;
    if (title !== null) doc.title = title;
    if (favicon !== null) {
        doc.querySelectorAll("link[rel*='icon']").forEach(e => e.remove());
        if (favicon !== "") {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = favicon + "?v=" + Date.now();
            doc.head.appendChild(link);
        }
    }
}

function applySavedCloak() {
    const cloakDisabled = localStorage.getItem('cloak-disabled') === 'true';
    
    if (cloakDisabled) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('settings') || currentPath.includes('s.html')) {
            applyTabCloak("Saturn", ORIGINAL_FAVICON);
        }
        return;
    }
    
    const savedTitle = localStorage.getItem('custom-title');
    const savedFavicon = localStorage.getItem('custom-favicon');
    
    if (savedTitle || savedFavicon) {
        applyTabCloak(
            savedTitle || null,
            savedFavicon || null
        );
    }
}

function clearCloak() {
    localStorage.removeItem('custom-title');
    localStorage.removeItem('custom-favicon');
    localStorage.setItem('cloak-disabled', 'true'); 
    
    const currentPath = window.location.pathname;
    if (currentPath.includes('settings') || currentPath.includes('s.html')) {
        applyTabCloak("Saturn", ORIGINAL_FAVICON);
    }
    
    alert('Cloak cleared! Default title and favicon restored.');
}

function setCloak(title, favicon) {
    localStorage.removeItem('cloak-disabled'); 
    localStorage.setItem('custom-title', title);
    localStorage.setItem('custom-favicon', favicon);
    applyTabCloak(title, favicon);
    alert(`Cloak applied: ${title}`);
}

function setCustomTitle() {
    const title = document.getElementById('custom-title').value;
    if (title) {
        localStorage.removeItem('cloak-disabled'); 
        localStorage.setItem('custom-title', title);
        const savedFavicon = localStorage.getItem('custom-favicon');
        applyTabCloak(title, savedFavicon);
        alert('Custom title applied!');
    }
}

function setCustomFavicon() {
    const favicon = document.getElementById('custom-favicon').value;
    if (favicon) {
        localStorage.removeItem('cloak-disabled'); 
        localStorage.setItem('custom-favicon', favicon);
        const savedTitle = localStorage.getItem('custom-title');
        applyTabCloak(savedTitle, favicon);
        alert('Custom favicon applied!');
    }
}

function openAboutBlank() {
    const win = window.open();
    const iframe = win.document.createElement('iframe');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = window.location.origin;
    win.document.body.style.margin = "0";
    win.document.body.appendChild(iframe);
}

let connection;
function initProxy() {
    if (typeof BareMux !== 'undefined') {
        connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        transportDisplay();
        searchEngineDisplay();
        proxyBackendDisplay();
    }
}

function transportDisplay() {
    const transport = localStorage.getItem('proxy-transport') || 'Epoxy';
    const transportEl = document.getElementById('proxtrans');
    if (transportEl) transportEl.textContent = transport;
}

function searchEngineDisplay() {
    const searchEngine = localStorage.getItem('search-engine') || 'DuckDuckGo';
    const searchEngineEl = document.getElementById('search-engine-display');
    if (searchEngineEl) searchEngineEl.textContent = searchEngine;
}

function proxyBackendDisplay() {
    const backend = localStorage.getItem('proxy-backend') || 'scramjet';
    window.currentProxyBackend = backend;
    const backendEl = document.getElementById('proxy-backend-status');
    if (backendEl) {
        backendEl.textContent = backend === 'scramjet' ? 'Scramjet' : 'Ultraviolet';
    }
    console.log(`[settings.js] Displayed backend: ${backend}`);
}

async function setConnection(arg) {
    if (!connection) { alert('Proxy scripts are still loading.'); return; }
    const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    try {
        switch (arg) {
            case 1: 
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]); 
                localStorage.setItem('proxy-transport','Epoxy'); 
                break;
            case 2: 
                await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]); 
                localStorage.setItem('proxy-transport','Libcurl'); 
                break;
        }
        transportDisplay();
        alert('Transport changed successfully!');
    } catch (err) { 
        console.error(err); 
        alert('Failed to set transport.'); 
    }
}

function setSearchEngine(engine) {
    const engines = {
        'duckduckgo': { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
        'google': { name: 'Google', url: 'https://www.google.com/search?q=%s' },
        'brave': { name: 'Brave', url: 'https://search.brave.com/search?q=%s' },
        'bing': { name: 'Bing', url: 'https://www.bing.com/search?q=%s' }
    };
    
    if (engines[engine]) {
        localStorage.setItem('search-engine', engines[engine].name);
        localStorage.setItem('search-engine-url', engines[engine].url);
        searchEngineDisplay();
        alert(`Search engine changed to ${engines[engine].name}!`);
    }
}

function setProxyBackend(backend) {
    console.log(`[settings.js] Setting proxy backend to: ${backend}`);
    
    localStorage.setItem('proxy-backend', backend);
    window.currentProxyBackend = backend;
    
    if (typeof switchProxyBackend === 'function') {
        switchProxyBackend(backend);
    }
    
    proxyBackendDisplay();
    
    alert(`Proxy backend changed to ${backend === 'scramjet' ? 'Scramjet' : 'Ultraviolet'}! Reload the page or create a new tab for changes to take effect.`);
}

window.addEventListener('storage', (e) => {
    if (e.key === 'theme-change-event') {
        try {
            const data = JSON.parse(e.newValue);
            if (data && data.theme) {
                console.log('[settings.js] Theme change detected:', data.theme);
                applyTheme();
                applyBackground();
            }
        } catch (err) {
            console.error('[settings.js] Error parsing theme change:', err);
        }
    }
});

if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('theme_channel');
    channel.addEventListener('message', (event) => {
        if (event.data.type === 'themeChange') {
            console.log('[settings.js] Theme change via BroadcastChannel:', event.data.theme);
            applyTheme();
            applyBackground();
        }
    });
}

window.addEventListener('load', () => {
    setTimeout(initProxy, 500);
});