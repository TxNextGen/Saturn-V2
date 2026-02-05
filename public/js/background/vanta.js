(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        const style = document.createElement('style');
        style.id = 'custom-theme-style';
        style.textContent = savedTheme;
        document.head.appendChild(style);
    }
})();

let vantaEffect = null;

function getThemeColors() {
    const themeName = localStorage.getItem('current-theme-name') || 'default';
    const colors = {
        'default': { 
            backgroundColor: 0x0d0415,  
            color: 0xb026d3,            
            color2: 0xd946ef,           
            size: 1.2,
            spacing: 18
        },
        'blue': { 
            backgroundColor: 0x0a1628,  
            color: 0x4776d9,            
            color2: 0x6487e6,        
            size: 1.2,
            spacing: 18
        },
        'night': { 
            backgroundColor: 0x0f0f0f,  
            color: 0x818181,            
            color2: 0xb3b3b3,          
            size: 1.2,
            spacing: 18
        },
        'red': { 
            backgroundColor: 0x1a0a0a,  
            color: 0x974646,           
            color2: 0xffa0a0,          
            size: 1.2,
            spacing: 18
        },
        'green': { 
            backgroundColor: 0x0a1a0a,  
            color: 0x62be46,            
            color2: 0xa8ffa0,           
            size: 1.2,
            spacing: 18
        }
    };
    return colors[themeName] || colors['default'];
}

function loadVantaGlobe() {

    if (vantaEffect) {
        vantaEffect.destroy();
        vantaEffect = null;
    }

    const colors = getThemeColors();
    const container = document.getElementById('particles-js');
    
    if (!container) {
        console.error('Vanta container not found');
        return;
    }

 
    if (typeof VANTA === 'undefined' || typeof VANTA.GLOBE === 'undefined') {
        console.error('VANTA.GLOBE not loaded. Make sure you included the script tags.');
        return;
    }

    try {
        vantaEffect = VANTA.GLOBE({
            el: container,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: colors.backgroundColor,
            color: colors.color,
            color2: colors.color2,
            size: colors.size,
            spacing: colors.spacing,
            points: 12.00,
            maxDistance: 22.00,
            showDots: true
        });
        
        console.log('Vanta Globe loaded successfully with theme:', localStorage.getItem('current-theme-name') || 'default');
    } catch (error) {
        console.error('Error loading Vanta Globe:', error);
    }
}


window.addEventListener('storage', (e) => {
    if (e.key === 'theme' || e.key === 'theme-change-event') {
        const newTheme = localStorage.getItem('theme');
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        if (newTheme) {
            const style = document.createElement('style');
            style.id = 'custom-theme-style';
            style.textContent = newTheme;
            document.head.appendChild(style);
        }
        
      
        setTimeout(() => loadVantaGlobe(), 100);
    }
});


if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('theme_channel');
    channel.addEventListener('message', (event) => {
        if (event.data.type === 'themeChange') {
            setTimeout(() => loadVantaGlobe(), 100);
        }
    });
}


window.addEventListener('themeChange', (event) => {
    setTimeout(() => loadVantaGlobe(), 100);
});


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        
        setTimeout(loadVantaGlobe, 500);
    });
} else {
    setTimeout(loadVantaGlobe, 500);
}


window.addEventListener('beforeunload', () => {
    if (vantaEffect) {
        vantaEffect.destroy();
    }
});