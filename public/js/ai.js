import { GROQ_API_KEY } from './config.js';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';


console.log('=== API Key Debug ===');
console.log('API Key exists:', !!GROQ_API_KEY);
console.log('API Key length:', GROQ_API_KEY.length);
if (GROQ_API_KEY && GROQ_API_KEY !== 'gsk_paste_your_key_here_after_gsk_') {
    console.log('API Key preview:', GROQ_API_KEY.substring(0, 7) + '...' + GROQ_API_KEY.substring(GROQ_API_KEY.length - 4));
    console.log('✅ API Key loaded successfully');
} else {
    console.error('❌ NO API KEY FOUND!');
    console.log('Setup Instructions:');
    console.log('1. Open js/config.js');
    console.log('2. Replace "paste_your_key_here_after_gsk_" with your actual Groq API key');
    console.log('3. Save the file');
    console.log('4. Refresh the page');
}


let currentModel = 'llama-3.1-8b';
let conversationHistory = [];
let storageReady = false;


const hasWindowStorage = typeof window !== 'undefined' && window.storage;


const GROQ_MODELS = {
    'llama-3.1-8b': 'llama-3.1-8b-instant'
};


const themeParticleColors = {
    'default': ['#b026d3', '#d946ef', '#a855f7'],
    'blue': ['#6487e6', '#4776d9', '#a0b1ff'],
    'night': ['#818181', '#505050', '#b3b3b3'],
    'red': ['#974646', '#722929', '#ffa0a0'],
    'green': ['#89e664', '#62be46', '#a8ffa0']
};


function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const existingStyle = document.getElementById('custom-theme-style');
        if (existingStyle) existingStyle.remove();
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';
        styleElement.textContent = savedTheme;
        document.head.appendChild(styleElement);
        console.log('✅ Theme applied from localStorage');
    }
}


function updateParticleColors(themeName) {
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        const colors = themeParticleColors[themeName] || themeParticleColors.default;
        pJSDom[0].pJS.particles.color.value = colors;
        pJSDom[0].pJS.particles.line_linked.color = colors[0];
        pJSDom[0].pJS.fn.particlesRefresh();
        console.log(`✅ Particles updated for ${themeName} theme`);
    }
}


window.addEventListener('storage', (e) => {
    if (e.key === 'theme-change-event') {
        try {
            const data = JSON.parse(e.newValue);
            if (data && data.theme) {
                console.log('[ai.js] Theme change detected:', data.theme);
                applyTheme();
                updateParticleColors(data.theme);
            }
        } catch (err) {
            console.error('[ai.js] Error parsing theme change:', err);
        }
    }
});


if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('theme_channel');
    channel.addEventListener('message', (event) => {
        if (event.data.type === 'themeChange') {
            console.log('[ai.js] Theme change via BroadcastChannel:', event.data.theme);
            applyTheme();
            updateParticleColors(event.data.theme);
        }
    });
}


async function loadSavedModel() {
    try {
        let savedModel = null;
        
        if (hasWindowStorage) {
            const result = await window.storage.get('saturn-ai-model');
            savedModel = result?.value;
        } else {
            savedModel = localStorage.getItem('saturn-ai-model');
        }
        
        if (savedModel) {
            currentModel = savedModel;
            console.log('✅ Loaded saved model:', currentModel);
            return true;
        } else {
            console.log('ℹ️ No saved model found, using default:', currentModel);
            return false;
        }
    } catch (error) {
        console.log('⚠️ Storage error, using default model:', error);
        return false;
    }
}


async function saveModel(model) {
    try {
        if (hasWindowStorage) {
            await window.storage.set('saturn-ai-model', model);
        } else {
            localStorage.setItem('saturn-ai-model', model);
        }
        console.log('✅ Model saved successfully:', model);
        return true;
    } catch (error) {
        console.error('❌ Failed to save model:', error);
        return false;
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Saturn AI initializing...');
    
 
    applyTheme();
    
   
    const currentThemeName = localStorage.getItem('current-theme-name') || 'default';
    setTimeout(() => {
        updateParticleColors(currentThemeName);
    }, 500);
    
  
    await loadSavedModel();
    
  
    const dropdown = document.getElementById('model-dropdown');
    if (dropdown) {
        dropdown.value = currentModel;
    }
    
    storageReady = true;
    console.log('✅ Saturn AI initialized with model:', currentModel);
});


const modelDropdown = document.getElementById('model-dropdown');
if (modelDropdown) {
    modelDropdown.addEventListener('change', async function() {
        const newModel = this.value;
        console.log('🔄 Switching from', currentModel, 'to', newModel);
        
        currentModel = newModel;
        
        const saved = await saveModel(currentModel);
        
        if (saved) {
            console.log('✅ Model switched and saved:', currentModel);
        } else {
            console.log('⚠️ Model switched but not saved:', currentModel);
        }
    });
}


const chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });


    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}


const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}


function addMessage(content, isUser) {
    const messagesContainer = document.getElementById('chat-messages');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    if (welcomeScreen) {
        welcomeScreen.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (isUser) {
        avatar.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>`;
    } else {
        avatar.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>`;
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    messagesContainer.insertBefore(messageDiv, document.getElementById('typing-indicator'));
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


function formatMessage(text) {
 
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    return text.replace(/\n/g, '<br>');
}


function showTyping(show) {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.classList.toggle('active', show);
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}


async function callGroqAPI(messages) {
   
    if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_paste_your_key_here_after_gsk_') {
        throw new Error('API key not configured. Please edit js/config.js and add your Groq API key.');
    }

    const modelName = GROQ_MODELS[currentModel] || GROQ_MODELS['llama-3.1-8b'];
    
    console.log('📡 Calling Groq API...');
    console.log('Model:', modelName);
    console.log('API Key present:', !!GROQ_API_KEY);
    console.log('Endpoint:', GROQ_ENDPOINT);
    
    try {
        const response = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName,
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            
            if (response.status === 401) {
                throw new Error('Invalid API Key - Please check your config.js file');
            }
            
            throw new Error(`Groq API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ API call successful');
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}


async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
  
    if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_paste_your_key_here_after_gsk_') {
        addMessage('❌ API Key not configured! Please open js/config.js and add your Groq API key.', false);
        return;
    }
    

    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    
  
    input.value = '';
    input.style.height = 'auto';
    
 
    showTyping(true);
    
    try {
     
        const aiResponse = await callGroqAPI(conversationHistory);
        
    
        showTyping(false);
        
      
        addMessage(aiResponse, false);
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        
    } catch (error) {
        showTyping(false);
        console.error('❌ API Error:', error);
        
        let errorMessage = `❌ Error: ${error.message}\n\n`;
        
        if (error.message.includes('Invalid API Key')) {
            errorMessage += `Please check:\n`;
            errorMessage += `1. Open js/config.js\n`;
            errorMessage += `2. Make sure your API key is correct\n`;
            errorMessage += `3. Get a key from https://console.groq.com/keys`;
        } else {
            errorMessage += `Please check:\n`;
            errorMessage += `1. Your internet connection\n`;
            errorMessage += `2. You have available credits on Groq\n`;
            errorMessage += `3. The console for more details`;
        }
        
        addMessage(errorMessage, false);
    }
}