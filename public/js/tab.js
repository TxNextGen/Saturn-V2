let _connection = new BareMux.BareMuxConnection("/baremux/worker.js");
let scramjetController = null;
let swReady = false;

async function initScramjet() {
    if (scramjetController) return scramjetController;
    
    try {
        console.log('[Scramjet] Initializing controller...');
        
        if (typeof $scramjetLoadController === 'undefined') {
            const script = document.createElement('script');
            script.src = '/js/scramjet/scramjet.all.js';
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (typeof $scramjetLoadController === 'function') {
            const { ScramjetController } = $scramjetLoadController();
            
            scramjetController = new ScramjetController({
                prefix: "/scramjet/",
                files: {
                    wasm: "/js/scramjet/scramjet.wasm.wasm",
                    all: "/js/scramjet/scramjet.all.js",
                    sync: "/js/scramjet/scramjet.sync.js"
                }
            });
            
            await scramjetController.init();
            console.log('[Scramjet] ✅ Controller initialized');
            return scramjetController;
        } else {
            throw new Error('$scramjetLoadController is not available');
        }
    } catch (err) {
        console.error('[Scramjet] ❌ Failed to initialize:', err);
        throw err;
    }
}

async function registerSW() {
    if (!('serviceWorker' in navigator)) {
        throw new Error("Service workers not supported");
    }

    if (swReady) return;

    const backend = getProxyBackend();
    console.log(`[registerSW] Registering ${backend.toUpperCase()} service worker...`);

    try {
        if (backend === "scramjet") {
            await initScramjet();
            
            const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            
            if (reg.installing) {
                await new Promise((resolve) => {
                    reg.installing.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') resolve();
                    });
                });
            } else if (reg.waiting) {
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                await new Promise((resolve) => {
                    navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
                });
            }
            
            await navigator.serviceWorker.ready;
            
            if (!navigator.serviceWorker.controller) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (!navigator.serviceWorker.controller) {
                    console.warn('[registerSW] No controller, reloading...');
                    window.location.reload();
                    return;
                }
            }
            
            console.log('[registerSW] ✅ SCRAMJET Service Worker registered');
        } else {
            const reg = await navigator.serviceWorker.register('/uv/sw.js', { scope: '/@/' });
            await navigator.serviceWorker.ready;
            console.log('[registerSW] ✅ UV Service Worker registered');
        }
        
        swReady = true;
    } catch (error) {
        console.error('[registerSW] Failed:', error);
        throw error;
    }
}

function getProxyBackend() {
    return localStorage.getItem('proxy-backend') || 'scramjet';
}

window.currentProxyBackend = getProxyBackend();

function switchProxyBackend(backend) {
    window.currentProxyBackend = backend;
    localStorage.setItem('proxy-backend', backend);
    swReady = false;
}

function getEncodedUrl(url) {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const backend = getProxyBackend();

    if (backend === "scramjet") {
        if (!scramjetController) return url;
        return scramjetController.encodeUrl(url);
    } else {
        if (typeof __uv$config === 'undefined' || typeof __uv$config.encodeUrl !== 'function') {
            return __uv$config.prefix + encodeURIComponent(url);
        }
        return __uv$config.prefix + __uv$config.encodeUrl(url);
    }
}


window.getEncodedUrl = getEncodedUrl;

async function setConnection(arg) {
    const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    
    try {
        switch (arg) {
            case 1:
                await _connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                localStorage.setItem('proxy-transport', 'Epoxy');
                console.log('[Transport] ✅ Set to Epoxy');
                break;
            case 2:
                await _connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
                localStorage.setItem('proxy-transport', 'Libcurl');
                console.log('[Transport] ✅ Set to Libcurl');
                break;
        }
    } catch (error) {
        console.error('[Transport] Failed to set:', error);
    }
}


(async () => {
    const savedTransport = localStorage.getItem('proxy-transport');
    if (!savedTransport) {
        await setConnection(1);
    } else {
        if (savedTransport === "Epoxy") await setConnection(1);
        if (savedTransport === "Libcurl") await setConnection(2);
    }
})();

if (!localStorage.getItem('search-engine')) {
    localStorage.setItem('search-engine', 'DuckDuckGo');
    localStorage.setItem('search-engine-url', 'https://duckduckgo.com/?q=%s');
}

if (!localStorage.getItem('proxy-backend')) {
    localStorage.setItem('proxy-backend', 'scramjet');
}


if (!localStorage.getItem('sidebar-state')) {
    localStorage.setItem('sidebar-state', 'open');
}


const MENU_PAGES = {
    games:    { route: '/pages/g.html',  title: 'Games' },
    apps:     { route: '/pages/a.html',  title: 'Apps' },
    ai:       { route: '/pages/ai.html', title: 'AI' },
    settings: { route: '/pages/s.html',  title: 'Settings' }
};


let tabs = [];
let activeTabId = null;
let tabIdCounter = 0;
let erudaLoaded = false;

class Tab {
    constructor(url = null, forcedTitle = null) {
        this.id = tabIdCounter++;
        this.url = url || '';
        this.title = forcedTitle || (url ? 'Loading...' : 'New Tab');
        this.favicon = '';
        this.isLoading = false;
        this.isLocalPage = false;   
        this.container = null;
        this.iframe = null;
        this.tabElement = null;
    }
}

function createTabElement(tab) {
    const tabEl = document.createElement('div');
    tabEl.className = 'sidebar-tab';
    tabEl.dataset.tabId = tab.id;
    
    const faviconSrc = tab.favicon || '/images/sat4.png';
    
    tabEl.innerHTML = `
        <img class="sidebar-tab-favicon" src="${faviconSrc}" alt="">
        <span class="sidebar-tab-title">${tab.title}</span>
        <div class="sidebar-tab-close">
            <img src="/images/icons/x.svg" alt="" class="nav-icon">
        </div>
    `;
    
    tabEl.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar-tab-close')) {
            switchTab(tab.id);
        }
    });
    
    tabEl.querySelector('.sidebar-tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tab.id);
    });
    
    tab.tabElement = tabEl;
    return tabEl;
}

function createIframeContainer(tab) {
    const container = document.createElement('div');
    container.className = 'iframe-container';
    container.dataset.tabId = tab.id;
    
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-read; clipboard-write');
    
    if (tab.url) {
        createLoadingOverlay(container);
        tab.isLoading = true;
        if (tab.tabElement) tab.tabElement.classList.add('loading');
        
        
        iframe.src = tab.isLocalPage ? tab.url : getEncodedUrl(tab.url);
    }
    
    iframe.addEventListener('load', () => {
        removeLoadingOverlay(container);
        tab.isLoading = false;
        if (tab.tabElement) tab.tabElement.classList.remove('loading');
        updateTabInfo(tab);
    });
    
    iframe.addEventListener('error', () => {
        removeLoadingOverlay(container);
        tab.isLoading = false;
        if (tab.tabElement) tab.tabElement.classList.remove('loading');
    });
    
    container.appendChild(iframe);
    tab.container = container;
    tab.iframe = iframe;
    
    return container;
}

function createLoadingOverlay(container) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'proxy-loading-animation';
    loadingDiv.innerHTML = `
        <div class="loading-bar-container">
            <div class="loading-bar indeterminate"></div>
        </div>
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading your page...</div>
        </div>
    `;
    container.appendChild(loadingDiv);
    return loadingDiv;
}

function removeLoadingOverlay(container) {
    const loading = container.querySelector('.proxy-loading-animation');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
    }
}

function updateTabInfo(tab) {
    if (!tab.iframe) return;
    
    try {
        const iframeDoc = tab.iframe.contentDocument || tab.iframe.contentWindow.document;
        if (iframeDoc && iframeDoc.title) {
            tab.title = iframeDoc.title || tab.url || 'New Tab';
            if (tab.tabElement) {
                const titleEl = tab.tabElement.querySelector('.sidebar-tab-title');
                if (titleEl) titleEl.textContent = tab.title;
            }
        }
    } catch (e) {
    
        if (tab.url && !tab.isLocalPage) {
            try {
                tab.title = new URL(tab.url).hostname;
                if (tab.tabElement) {
                    const titleEl = tab.tabElement.querySelector('.sidebar-tab-title');
                    if (titleEl) titleEl.textContent = tab.title;
                }
            } catch (err) {}
        }
    }
}


async function createTab(url = null, forcedTitle = null, isLocalPage = false) {

    if (url && !isLocalPage && !swReady) {
        try {
            await registerSW();
        } catch (err) {
            console.error('Failed to register service worker:', err);
            return null;
        }
    }
    
    const tab = new Tab(url, forcedTitle);
    tab.isLocalPage = isLocalPage;
    tabs.push(tab);
    
    const tabElement = createTabElement(tab);
    const container = createIframeContainer(tab);
    
    const sidebarTabs = document.getElementById('sidebar-tabs');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    
    if (sidebarTabs) sidebarTabs.appendChild(tabElement);
    if (iframeWrapper) iframeWrapper.appendChild(container);
    
    switchTab(tab.id);
    
    return tab;
}

function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    const homeContainer = document.getElementById('home-container');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    
    tabs.forEach(t => {
        if (t.tabElement) t.tabElement.classList.remove('active');
        if (t.container) t.container.classList.remove('active');
    });
    
    if (tab.tabElement) tab.tabElement.classList.add('active');
    tab.container.classList.add('active');
    activeTabId = tab.id;

 
    window.activeTabId = activeTabId;
    
    if (tab.url) {
        if (homeContainer) homeContainer.style.display = 'none';
        if (iframeWrapper) iframeWrapper.classList.add('active');
    } else {
        if (homeContainer) homeContainer.style.display = 'flex';
        if (iframeWrapper) iframeWrapper.classList.remove('active');
    }
    
    updateUrlBar(tab);
}

function closeTab(tabId) {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const tab = tabs[tabIndex];
    
    if (tab.tabElement) tab.tabElement.remove();
    if (tab.container) tab.container.remove();
    
    tabs.splice(tabIndex, 1);
    
    if (tab.id === activeTabId) {
        if (tabs.length > 0) {
            switchTab(tabs[Math.max(0, tabIndex - 1)].id);
        } else {
            createTab();
        }
    }
}

async function navigateTab(tabId, url) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || !tab.iframe || !tab.container) return;
    
    if (!swReady) {
        try {
            await registerSW();
        } catch (err) {
            console.error('Failed to register service worker:', err);
            return;
        }
    }
    
    tab.url = url;
    tab.isLocalPage = false;
    tab.isLoading = true;
    tab.title = 'Loading...';
    
    if (tab.tabElement) {
        tab.tabElement.classList.add('loading');
        const titleEl = tab.tabElement.querySelector('.sidebar-tab-title');
        if (titleEl) titleEl.textContent = tab.title;
    }
    
    createLoadingOverlay(tab.container);
    tab.iframe.src = getEncodedUrl(url);
    updateUrlBar(tab);
    
    const homeContainer = document.getElementById('home-container');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    if (homeContainer) homeContainer.style.display = 'none';
    if (iframeWrapper) iframeWrapper.classList.add('active');
}

function updateUrlBar(tab) {
    const urlBar = document.getElementById('proxy-url-bar');
    if (urlBar && tab) {
        urlBar.value = tab.url || '';
    }
}

function buildUrl(query) {
    query = (query || '').trim();
    if (!query) return null;

    if (/^https?:\/\//i.test(query)) return query;
    if (query.includes(' ')) {
        const searchEngine = localStorage.getItem('search-engine-url') || 'https://duckduckgo.com/?q=%s';
        return searchEngine.replace('%s', encodeURIComponent(query));
    }
    if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/i.test(query) || /^localhost(:\d+)?(\/.*)?$/i.test(query)) {
        return 'https://' + query;
    }
    
    const searchEngine = localStorage.getItem('search-engine-url') || 'https://duckduckgo.com/?q=%s';
    return searchEngine.replace('%s', encodeURIComponent(query));
}

function toggleSearchEnginePopup() {
    let popup = document.getElementById('search-engine-popup');
    if (popup) { popup.remove(); return; }
    
    popup = document.createElement('div');
    popup.id = 'search-engine-popup';
    popup.className = 'quick-popup';
    
    const currentEngine = localStorage.getItem('search-engine') || 'DuckDuckGo';
    
    popup.innerHTML = `
        <div class="popup-header">Search Engine</div>
        <div class="popup-option ${currentEngine === 'DuckDuckGo' ? 'active' : ''}" data-engine="duckduckgo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentEngine === 'DuckDuckGo' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
            <span>DuckDuckGo</span>
        </div>
        <div class="popup-option ${currentEngine === 'Google' ? 'active' : ''}" data-engine="google">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentEngine === 'Google' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
            <span>Google</span>
        </div>
        <div class="popup-option ${currentEngine === 'Brave' ? 'active' : ''}" data-engine="brave">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentEngine === 'Brave' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
            <span>Brave</span>
        </div>
        <div class="popup-option ${currentEngine === 'Bing' ? 'active' : ''}" data-engine="bing">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentEngine === 'Bing' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
            <span>Bing</span>
        </div>
    `;
    
    document.body.appendChild(popup);

    const searchBtn = document.querySelector('.search-engine-btn');
    if (searchBtn) {
        const rect = searchBtn.getBoundingClientRect();
        popup.style.top = `${rect.bottom + 8}px`;
        popup.style.left = `${rect.left}px`;
    }
    
    popup.querySelectorAll('.popup-option').forEach(option => {
        option.addEventListener('click', () => {
            const engines = {
                'duckduckgo': { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
                'google':     { name: 'Google',     url: 'https://www.google.com/search?q=%s' },
                'brave':      { name: 'Brave',      url: 'https://search.brave.com/search?q=%s' },
                'bing':       { name: 'Bing',       url: 'https://www.bing.com/search?q=%s' }
            };
            const engine = option.getAttribute('data-engine');
            if (engines[engine]) {
                localStorage.setItem('search-engine', engines[engine].name);
                localStorage.setItem('search-engine-url', engines[engine].url);
            }
            popup.remove();
        });
    });

    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && !e.target.closest('.search-engine-btn')) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

function toggleQuickSettings() {
    let popup = document.getElementById('quick-settings-popup');
    if (popup) { popup.remove(); return; }
    
    popup = document.createElement('div');
    popup.id = 'quick-settings-popup';
    popup.className = 'quick-popup quick-settings';
    
    const currentTransport = localStorage.getItem('proxy-transport') || 'Epoxy';
    const currentBackend   = localStorage.getItem('proxy-backend')   || 'scramjet';
    
    popup.innerHTML = `
        <div class="popup-header">Quick Settings</div>
        <div class="popup-section">
            <div class="popup-section-title">Proxy Transport</div>
            <div class="popup-option ${currentTransport === 'Epoxy' ? 'active' : ''}" data-action="transport-epoxy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentTransport === 'Epoxy' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
                <span>Epoxy</span>
            </div>
            <div class="popup-option ${currentTransport === 'Libcurl' ? 'active' : ''}" data-action="transport-libcurl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentTransport === 'Libcurl' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
                <span>Libcurl</span>
            </div>
        </div>
        <div class="popup-section">
            <div class="popup-section-title">Proxy Backend</div>
            <div class="popup-option ${currentBackend === 'uv' ? 'active' : ''}" data-action="backend-uv">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentBackend === 'uv' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
                <span>Ultraviolet</span>
            </div>
            <div class="popup-option ${currentBackend === 'scramjet' ? 'active' : ''}" data-action="backend-scramjet">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${currentBackend === 'scramjet' ? '<polyline points="20 6 9 17 4 12"></polyline>' : ''}</svg>
                <span>Scramjet</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        const rect = settingsBtn.getBoundingClientRect();
        popup.style.top = `${rect.bottom + 8}px`;
        popup.style.right = `${window.innerWidth - rect.right}px`;
        popup.style.left = 'auto';
    }

    popup.querySelectorAll('.popup-option').forEach(option => {
        option.addEventListener('click', async () => {
            const action = option.getAttribute('data-action');
            switch(action) {
                case 'transport-epoxy':    await setConnection(1); break;
                case 'transport-libcurl':  await setConnection(2); break;
                case 'backend-uv':         switchProxyBackend('uv'); break;
                case 'backend-scramjet':   switchProxyBackend('scramjet'); break;
            }
            popup.remove();
            setTimeout(() => toggleQuickSettings(), 100);
        });
    });

    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && !e.target.closest('.settings-btn')) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}


function toggleMenuPopup() {
    let popup = document.getElementById('menu-popup');
    if (popup) { popup.remove(); return; }
    
    popup = document.createElement('div');
    popup.id = 'menu-popup';
    popup.className = 'quick-popup';
    
    popup.innerHTML = `
        <div class="popup-header">Menu</div>
        <div class="popup-option" data-action="games">
            <img src="/images/icons/games.svg" alt="" class="nav-icon">
            <span>Games</span>
        </div>
        <div class="popup-option" data-action="apps">
            <img src="/images/icons/apps.svg" alt="" class="nav-icon">
            <span>Apps</span>
        </div>
        <div class="popup-option" data-action="ai">
            <img src="/images/icons/ai.svg" alt="" class="nav-icon">
            <span>AI</span>
        </div>
        <div class="popup-option" data-action="settings">
            <img src="/images/icons/settings.svg" alt="" class="nav-icon">
            <span>Settings</span>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        const rect = menuBtn.getBoundingClientRect();
        popup.style.top  = `${rect.bottom + 8}px`;
        popup.style.right = `${window.innerWidth - rect.right}px`;
        popup.style.left  = 'auto';
    }

    popup.querySelectorAll('.popup-option').forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            const page   = MENU_PAGES[action];
            if (page) {
                createTab(page.route, page.title, true);
            }
            popup.remove();
        });
    });

    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target) && !e.target.closest('#menu-btn')) {
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

function injectDevTools() {
    if (erudaLoaded) {
        window.eruda._isInit ? window.eruda.destroy() : window.eruda.init();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/eruda/3.0.1/eruda.js';
    script.onload = () => {
        window.eruda.init();
        erudaLoaded = true;
    };
    document.head.appendChild(script);
}


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        localStorage.setItem('sidebar-state', 'open');
        console.log('[Sidebar] ✅ Opened');
    } else {
        sidebar.classList.add('collapsed');
        localStorage.setItem('sidebar-state', 'closed');
        console.log('[Sidebar] ✅ Closed');
    }
}


function initSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const savedState = localStorage.getItem('sidebar-state');
    
    if (savedState === 'closed') {
        sidebar.classList.add('collapsed');
        console.log('[Sidebar] Loaded in closed state');
    } else {
        sidebar.classList.remove('collapsed');
        console.log('[Sidebar] Loaded in open state');
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    console.log('[Tab System] Initializing...');
    
   
    initSidebarState();
    
    window.createTab    = createTab;
    window.navigateTab  = navigateTab;
    window.activeTabId  = activeTabId;   

    try { await registerSW(); }
    catch (err) { console.error('[Tab System] SW registration failed:', err); }
    
 
    createTab();
    
    const proxyUrlBar = document.getElementById('proxy-url-bar');
    const uvAddress   = document.getElementById('uv-address');
    
    if (proxyUrlBar) {
        proxyUrlBar.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const url = buildUrl(proxyUrlBar.value);
                if (url && activeTabId !== null) await navigateTab(activeTabId, url);
            }
        });
        proxyUrlBar.addEventListener('focus', () => proxyUrlBar.select());
    }

    if (uvAddress) {
        uvAddress.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const url = buildUrl(uvAddress.value);
                if (url && activeTabId !== null) await navigateTab(activeTabId, url);
            }
        });
    }

    const sidebarAddTab = document.getElementById('sidebar-add-tab');
    if (sidebarAddTab) sidebarAddTab.addEventListener('click', () => createTab());

  
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleSidebar);
        console.log('[Sidebar] Toggle button initialized');
    }

    const searchEngineBtn = document.querySelector('.search-engine-btn');
    if (searchEngineBtn) searchEngineBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSearchEnginePopup(); });

    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const t = tabs.find(t => t.id === activeTabId);
            if (t && t.iframe) { try { t.iframe.contentWindow.history.back(); } catch (e) {} }
        });
    }

    const forwardBtn = document.querySelector('.forward-btn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            const t = tabs.find(t => t.id === activeTabId);
            if (t && t.iframe) { try { t.iframe.contentWindow.history.forward(); } catch (e) {} }
        });
    }

    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const t = tabs.find(t => t.id === activeTabId);
            if (t && t.iframe) { try { t.iframe.contentWindow.location.reload(); } catch { t.iframe.src = t.iframe.src; } }
        });
    }

    const erudaBtn = document.querySelector('.eruda-btn');
    if (erudaBtn) erudaBtn.addEventListener('click', injectDevTools);

    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleQuickSettings(); });

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenuPopup(); });
    
    console.log('[Tab System] ✅ Initialized');
});