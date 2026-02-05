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
});


const premadeThemes = {
    "blue": `:root {
        --bg-secondary: #0d1021;
        --bg-tertiary: #1a2040;
        --text-secondary: #7d9dff;
        --accent: #4776d9;
        --accent-hover: #6487e6;
        --border: #2a4080;
        --accent-secondary: #6487e6;
        --modal-overlay: rgba(13, 16, 33, 0.85);
        --shadow-heavy: rgba(71, 118, 217, 0.5);
        --bg-card: rgba(16, 13, 41, 0.5);
        --accent-primary: #6487e6;
        --text-muted: #a0b1ff;
        --text-dim: rgba(160, 177, 255, 0.5);
        --border-color: rgba(100, 135, 230, 0.4);
        --border-glow: rgba(100, 135, 230, 0.3);
        --input-bg: rgba(16, 13, 41, 0.3);
        --input-bg-focus: rgba(16, 13, 41, 0.5);
        --btn-bg: rgba(71, 118, 217, 0.2);
        --btn-hover-bg: rgba(100, 135, 230, 0.3);
        --tab-active-bg: rgba(71, 118, 217, 0.3);
        --tab-active-shadow: 0 0 20px rgba(71, 118, 217, 0.5);
        --primary: #4776d9;
        --secondary: #6487e6;
        --glow: rgba(71, 118, 217, 0.45);
    }
    .home-title { color: #6487e6 !important; }
    .sidebar-add-tab { background: #4776d9 !important; }
    .sidebar-add-tab:hover { background: #6487e6 !important; }
    #uv-address:focus { border-color: #6487e6 !important; }
    .add-shortcut-btn:hover { border-color: #6487e6 !important; color: #6487e6 !important; }`,
    
    "night": `:root {
        --bg-secondary: #1a1a1a;
        --bg-tertiary: #2a2a2a;
        --text-secondary: #b3b3b3;
        --accent: #818181;
        --accent-hover: #9a9a9a;
        --border: #3a3a3a;
        --accent-secondary: #9a9a9a;
        --modal-overlay: rgba(26, 26, 26, 0.85);
        --shadow-heavy: rgba(129, 129, 129, 0.5);
        --bg-card: rgba(40, 40, 40, 0.5);
        --accent-primary: #b3b3b3;
        --text-muted: #b3b3b3;
        --text-dim: rgba(179, 179, 179, 0.5);
        --border-color: rgba(129, 129, 129, 0.4);
        --border-glow: rgba(129, 129, 129, 0.3);
        --input-bg: rgba(40, 40, 40, 0.3);
        --input-bg-focus: rgba(40, 40, 40, 0.5);
        --btn-bg: rgba(129, 129, 129, 0.2);
        --btn-hover-bg: rgba(129, 129, 129, 0.3);
        --tab-active-bg: rgba(129, 129, 129, 0.3);
        --tab-active-shadow: 0 0 20px rgba(129, 129, 129, 0.5);
        --primary: #818181;
        --secondary: #9a9a9a;
        --glow: rgba(129, 129, 129, 0.45);
    }
    .home-title { color: #b3b3b3 !important; }
    .sidebar-add-tab { background: #818181 !important; }
    .sidebar-add-tab:hover { background: #9a9a9a !important; }
    #uv-address:focus { border-color: #b3b3b3 !important; }
    .add-shortcut-btn:hover { border-color: #b3b3b3 !important; color: #b3b3b3 !important; }`,
    
    "red": `:root {
        --bg-secondary: #210d0d;
        --bg-tertiary: #3a1a1a;
        --text-secondary: #ff7d7d;
        --accent: #974646;
        --accent-hover: #b85656;
        --border: #4a2a2a;
        --accent-secondary: #b85656;
        --modal-overlay: rgba(33, 13, 13, 0.85);
        --shadow-heavy: rgba(151, 70, 70, 0.5);
        --bg-card: rgba(41, 13, 13, 0.5);
        --accent-primary: #ffa0a0;
        --text-muted: #ffa0a0;
        --text-dim: rgba(255, 160, 160, 0.5);
        --border-color: rgba(151, 70, 70, 0.4);
        --border-glow: rgba(151, 70, 70, 0.3);
        --input-bg: rgba(41, 13, 13, 0.3);
        --input-bg-focus: rgba(41, 13, 13, 0.5);
        --btn-bg: rgba(151, 70, 70, 0.2);
        --btn-hover-bg: rgba(151, 70, 70, 0.3);
        --tab-active-bg: rgba(151, 70, 70, 0.3);
        --tab-active-shadow: 0 0 20px rgba(151, 70, 70, 0.5);
        --primary: #974646;
        --secondary: #b85656;
        --glow: rgba(151, 70, 70, 0.45);
    }
    .home-title { color: #ffa0a0 !important; }
    .sidebar-add-tab { background: #974646 !important; }
    .sidebar-add-tab:hover { background: #b85656 !important; }
    #uv-address:focus { border-color: #ffa0a0 !important; }
    .add-shortcut-btn:hover { border-color: #ffa0a0 !important; color: #ffa0a0 !important; }`,
    
    "green": `:root {
        --bg-secondary: #0d210d;
        --bg-tertiary: #1a3a1a;
        --text-secondary: #8fff7d;
        --accent: #62be46;
        --accent-hover: #7dd664;
        --border: #2a4a2a;
        --accent-secondary: #7dd664;
        --modal-overlay: rgba(13, 33, 13, 0.85);
        --shadow-heavy: rgba(98, 190, 70, 0.5);
        --bg-card: rgba(22, 41, 13, 0.5);
        --accent-primary: #a8ffa0;
        --text-muted: #a8ffa0;
        --text-dim: rgba(168, 255, 160, 0.5);
        --border-color: rgba(137, 230, 100, 0.4);
        --border-glow: rgba(137, 230, 100, 0.3);
        --input-bg: rgba(22, 41, 13, 0.3);
        --input-bg-focus: rgba(22, 41, 13, 0.5);
        --btn-bg: rgba(98, 190, 70, 0.2);
        --btn-hover-bg: rgba(137, 230, 100, 0.3);
        --tab-active-bg: rgba(98, 190, 70, 0.3);
        --tab-active-shadow: 0 0 20px rgba(98, 190, 70, 0.5);
        --primary: #62be46;
        --secondary: #7dd664;
        --glow: rgba(98, 190, 70, 0.45);
    }
    .home-title { color: #a8ffa0 !important; }
    .sidebar-add-tab { background: #62be46 !important; }
    .sidebar-add-tab:hover { background: #7dd664 !important; }
    #uv-address:focus { border-color: #a8ffa0 !important; }
    .add-shortcut-btn:hover { border-color: #a8ffa0 !important; color: #a8ffa0 !important; }`
};


const themeParticleColors = {
    'default': ['#b026d3', '#d946ef', '#a855f7'],
    'blue': ['#6487e6', '#4776d9', '#a0b1ff'],
    'night': ['#818181', '#505050', '#b3b3b3'],
    'red': ['#974646', '#722929', '#ffa0a0'],
    'green': ['#89e664', '#62be46', '#a8ffa0']
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

function formatCSS(css) { 
    return css.replace(/\s*{\s*/g, ' {\n  ')
              .replace(/;\s*/g, ';\n  ')
              .replace(/\s*}\s*/g, '\n}');  
}

function applyTheme() {
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

function clearTheme() {
    localStorage.removeItem('theme');
    localStorage.removeItem('current-theme-name');
    localStorage.removeItem('custom-img');
    
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) existingStyle.remove();
    
    
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
  
    localStorage.setItem('theme', premadeThemes[theme]);
    localStorage.setItem('current-theme-name', theme);
    localStorage.removeItem('custom-img');
    
    
    const existingStyle = document.getElementById('custom-theme-style');
    if (existingStyle) existingStyle.remove();
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-theme-style';
    styleElement.textContent = premadeThemes[theme];
    document.head.appendChild(styleElement);
    
   
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
    
    alert(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied!`);
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
        alert('Custom image set! It will appear on other pages with the Saturn logo.');
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
        }
    });
}

window.addEventListener('load', () => {
    setTimeout(initProxy, 500);
});

window.addEventListener('DOMContentLoaded', () => {
    applyTheme();
});