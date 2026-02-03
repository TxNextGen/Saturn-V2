
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


function getThemeColors() {
    const themeName = localStorage.getItem('current-theme-name') || 'default';
    const colors = {
        'default': { particles: ['#b026d3', '#d946ef', '#a855f7'], line: '#b026d3' },
        'blue': { particles: ['#6487e6', '#4776d9', '#a0b1ff'], line: '#6487e6' },
        'night': { particles: ['#818181', '#505050', '#b3b3b3'], line: '#818181' },
        'red': { particles: ['#974646', '#722929', '#ffa0a0'], line: '#974646' },
        'green': { particles: ['#89e664', '#62be46', '#a8ffa0'], line: '#89e664' }
    };
    return colors[themeName] || colors['default'];
}


function loadParticles() {
    const colors = getThemeColors();
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": colors.particles
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": colors.line,
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": true
    });
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
   
        loadParticles();
    }
});


loadParticles();