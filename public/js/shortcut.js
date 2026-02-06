const FEATURE_CARDS = [
    {
        id: 'games',
        name: 'Games',
        icon: '/images/icons/games.svg',
        action: 'games'
    },
    {
        id: 'apps',
        name: 'Apps',
        icon: '/images/icons/apps.svg',
        action: 'apps'
    },
    {
        id: 'ai',
        name: 'AI',
        icon: '/images/icons/ai.svg',
        action: 'ai'
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: '/images/icons/settings.svg',
        action: 'settings'
    }
];


const MENU_PAGES = {
    games:    { route: '/pages/g.html',  title: 'Games' },
    apps:     { route: '/pages/a.html',  title: 'Apps' },
    ai:       { route: '/pages/ai.html', title: 'AI' },
    settings: { route: '/pages/s.html',  title: 'Settings' }
};

function renderShortcuts() {
    const container = document.getElementById('shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';

   
    FEATURE_CARDS.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'shortcut-item';
        cardEl.setAttribute('data-shortcut-id', card.id);

        const favicon = document.createElement('div');
        favicon.className = 'shortcut-favicon';

        const img = document.createElement('img');
        img.src = card.icon;
        img.alt = card.name;
        img.onerror = function () {
            this.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'shortcut-favicon-fallback';
            fallback.textContent = card.name.charAt(0).toUpperCase();
            favicon.appendChild(fallback);
        };
        favicon.appendChild(img);

        const name = document.createElement('div');
        name.className = 'shortcut-name';
        name.textContent = card.name;

   
        cardEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const page = MENU_PAGES[card.action];
            if (page && typeof window.createTab === 'function') {
                window.createTab(page.route, page.title, true);
            }
        });

        cardEl.appendChild(favicon);
        cardEl.appendChild(name);
        container.appendChild(cardEl);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('[Shortcuts] Initializing...');
    renderShortcuts();
    console.log('[Shortcuts] ✅ Initialized');
});