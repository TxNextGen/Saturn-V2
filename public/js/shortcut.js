const DEFAULT_SHORTCUTS = [
    {
        id: 'youtube',
        name: 'Youtube',
        url: 'https://www.youtube.com',
        favicon: '/images/yt1.png'
    },
    {
        id: 'tiktok',
        name: 'Tiktok',
        url: 'https://tiktok.com',
        favicon: '/images/tiktok.png'
    },
    {
        id: 'soundcloud',
        name: 'Soundcloud',
        url: 'https://soundcloud.com',
        favicon: '/images/cloud.jpg'
    },
    {
        id: 'geforce',
        name: 'GeForce',
        url: 'https://play.geforcenow.com',
        favicon: '/images/now.webp'
    }
];


function renderShortcuts() {
    const container = document.getElementById('shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';

    DEFAULT_SHORTCUTS.forEach(shortcut => {
        const shortcutEl = document.createElement('div');
        shortcutEl.className = 'shortcut-item';
        shortcutEl.setAttribute('data-shortcut-id', shortcut.id);

      
        const favicon = document.createElement('div');
        favicon.className = 'shortcut-favicon';

        const img = document.createElement('img');
        img.src = shortcut.favicon;
        img.alt = shortcut.name;
        img.onerror = function () {
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'shortcut-favicon-fallback';
            fallback.textContent = shortcut.name.charAt(0).toUpperCase();
            favicon.appendChild(fallback);
        };
        favicon.appendChild(img);

   
        const name = document.createElement('div');
        name.className = 'shortcut-name';
        name.textContent = shortcut.name;

   
        shortcutEl.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (typeof window.navigateTab === 'function' && window.activeTabId != null) {
                await window.navigateTab(window.activeTabId, shortcut.url);
            } else if (typeof window.createTab === 'function') {
                await window.createTab(shortcut.url);
            }
        });

        shortcutEl.appendChild(favicon);
        shortcutEl.appendChild(name);
        container.appendChild(shortcutEl);
    });
}


window.addEventListener('DOMContentLoaded', () => {
    console.log('[Shortcuts] Initializing...');
    renderShortcuts();
    console.log('[Shortcuts] ✅ Initialized');
});