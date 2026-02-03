let appsData = [];
let currentCategory = localStorage.getItem('selectedAppsCategory') || 'All';
let searchCache = new Map();


async function loadApps() {
   
    const preload = document.getElementById('preload');
    if (preload) preload.remove();

    try {
        console.log('[Apps] Fetching apps.json...');

        const response = await fetch('/json/apps.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        appsData = await response.json();
        console.log('[Apps] Loaded', appsData.length, 'apps');

    } catch (error) {
        console.error('[Apps] Error loading apps:', error);
        appsData = []; 
    }

    
    initializePage();
}


function initializePage() {
    console.log('[Apps] Initializing page...');

    populateCategories();
    renderApps();
    setupEventListeners();
    applyTheme();
    console.log('[Apps] Page initialized successfully');
}


function getCategories(items) {
    const categories = new Set();
    items.forEach(item => {
        if (item.category) categories.add(item.category);
    });
    return ['All', ...Array.from(categories).sort()];
}


function populateCategories() {
    const select = document.getElementById('categorySelect');
    if (!select) {
        console.error('[Apps] Category select element not found');
        return;
    }

    const categories = getCategories(appsData);
    console.log('[Apps] Categories:', categories);
    select.innerHTML = categories
        .map(cat => `<option value="${cat}" ${cat === currentCategory ? 'selected' : ''}>${cat}</option>`)
        .join('');
}


function filterApps() {
    const searchTerm = document.getElementById('searchBar')?.value.toLowerCase().trim() || '';
    const cacheKey = `${searchTerm}-${currentCategory}`;

    if (searchCache.has(cacheKey)) {
        renderFilteredApps(searchCache.get(cacheKey));
        return;
    }

    const filtered = appsData.filter(item => {
        const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
        const matchesSearch = !searchTerm ||
            item.title.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm));
        return matchesCategory && matchesSearch;
    });

    console.log('[Apps] Filtered to', filtered.length, 'apps');
    searchCache.set(cacheKey, filtered);
    renderFilteredApps(filtered);
}


function renderFilteredApps(items) {
    const grid = document.getElementById('gameCardsGrid');
    if (!grid) {
        console.error('[Apps] Grid element not found');
        return;
    }

    console.log('[Apps] Rendering', items.length, 'apps');
    grid.innerHTML = '';

    if (items.length === 0) {
        showNoResults(grid);
        return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item, index) => {
        const card = createAppCard(item, index);
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
    observeCards();
}


function createAppCard(item, index) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${item.title}`);


    const img = document.createElement('img');
    img.className = 'game-card-image';
    img.src = item.img || 'https://placehold.co/200x200/9333ea/ffffff?text=' + encodeURIComponent(item.title.substring(0, 2));
    img.alt = item.title;
    img.loading = 'lazy';

    
    const overlay = document.createElement('div');
    overlay.className = 'game-card-overlay';

    const title = document.createElement('h3');
    title.className = 'game-card-title';
    title.textContent = item.title;

    const category = document.createElement('span');
    category.className = 'game-card-category';
    category.textContent = item.category || 'App';

    overlay.appendChild(title);
    overlay.appendChild(category);
    card.appendChild(img);
    card.appendChild(overlay);


    card.addEventListener('click', () => openApp(item));
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openApp(item);
        }
    });

    return card;
}






function openApp(item) {
    console.log(`[Apps] Opening: ${item.title} | iframe: ${item.iframe} | path: ${item.path}`);

    if (item.iframe) {
    
        let path = item.path;
        if (!path.startsWith('/')) path = '/' + path;
        window.location.href = path;
    } else {
      
        const parent = window.parent;

        if (parent && typeof parent.navigateTab === 'function' && parent.activeTabId != null) {
            parent.navigateTab(parent.activeTabId, item.path);
        } else if (parent && typeof parent.createTab === 'function') {
            parent.createTab(item.path);
        } else {
       
            console.warn('[Apps] Parent tab system not available, falling back to direct navigate');
            window.location.href = item.path;
        }
    }
}


function showNoResults(container) {
    const msg = document.createElement('div');
    msg.id = 'noResultsMessage';
    msg.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h2>No Apps Found</h2>
        <p>Can't find the app you're looking for?<br>Join our Discord to request it!</p>
        <a href="https://discord.gg/vAF5AZHwwD" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Our Discord
        </a>
    `;
    container.appendChild(msg);
}


function renderApps() {
    filterApps();
}


function setupEventListeners() {
    const searchBar = document.getElementById('searchBar');
    const categorySelect = document.getElementById('categorySelect');

    if (searchBar) {
        let searchTimeout;
        searchBar.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchCache.clear();
                filterApps();
            }, 300);
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            localStorage.setItem('selectedAppsCategory', currentCategory);
            searchCache.clear();
            filterApps();
        });
    }
}


let observer;
function observeCards() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('.game-card').forEach(card => observer.observe(card));
}


function applyTheme() {
    const theme = localStorage.getItem('current-theme-name');
    if (theme && theme !== 'default' && theme !== 'custom') {
        document.body.classList.add(`theme-${theme}`);
    }
}


window.addEventListener('themeChange', (e) => {
    document.body.classList.remove('theme-blue', 'theme-night', 'theme-red', 'theme-green');
    const theme = e.detail.theme;
    if (theme && theme !== 'default' && theme !== 'custom') {
        document.body.classList.add(`theme-${theme}`);
    }
});


window.addEventListener('storage', (e) => {
    if (e.key === 'theme-change-event') {
        try {
            const data = JSON.parse(e.newValue);
            if (data && data.theme) applyTheme();
        } catch (err) {
            console.error('[Apps] Error parsing theme change:', err);
        }
    }
});


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[Apps] DOM Content Loaded');
        loadApps();
    });
} else {
    console.log('[Apps] Document already loaded');
    loadApps();
}