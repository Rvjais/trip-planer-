document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const newTripBtn = document.getElementById('newTripBtn');
    const itineraryOverlay = document.getElementById('itineraryOverlay');
    const itineraryBody = document.getElementById('itineraryBody');
    const closeItineraryBtn = document.getElementById('closeItineraryBtn');

    // Configuration
    // REPLACE THIS WITH YOUR ACTUAL OPENROUTER API KEY
    const API_KEY = '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';

    // State
    let conversationHistory = [];
    const SYSTEM_PROMPT = `You are move.ai, an expert AI Travel Planner. Your goal is to plan the perfect trip for the user.
    
    ### PHASE 1: GATHERING INFORMATION
    You MUST gather the following "Mandatory Information" before generating a plan. Do not ask all questions at once. Ask 1-2 questions at a time in a conversational way.
    
    Mandatory Information to Collect:
    1.  **Destination**: Where do they want to go?
    2.  **Origin**: Where are they starting from?
    3.  **Dates & Duration**: When and for how many days?
    4.  **Budget**: What is their total budget? (Low, Medium, High, or specific amount)
    5.  **Travelers**: How many people? (Solo, Couple, Family, Friends)
    6.  **Transportation Preference**: How do they want to travel? (Flight, Train, Bus, Car, etc.)
    7.  **Interests**: What do they like? (Nature, History, Food, Adventure, Relaxation)

    If the user misses any of these, politely ask for the missing details.
    
    ### PHASE 2: GENERATING THE PLAN
    Once you have ALL the mandatory information, ask: "I have all the details. Shall I generate your complete trip itinerary now?"
    
    If they say YES, generate the plan starting with "### TRIP PLAN ###".
    
    The final plan MUST be EXTREMELY DETAILED and REALISTIC. Do not give generic advice.
    
    **Required Structure:**
    
    1.  **Trip Overview**:
        -   Total Estimated Cost (broken down by category).
        -   Best Time to Visit (based on their dates).
        -   Local Currency & Exchange Rate.
    
    2.  **Transportation Details**:
        -   **Getting There**: Specific flight/train/bus numbers if possible, or exact routes. Estimated price per person.
        -   **Local Commute**: How to get around the city (Metro, Cab, Rental). Estimated daily cost.
    
    3.  **Accommodation**:
        -   Suggest 3 options (Budget, Mid-range, Luxury) fitting their preference.
        -   Include **Name**, **Price per night**, **Location**, and **Why it's a good choice**.
    
    4.  **Day-by-Day Itinerary (Hour-by-Hour)**:
        -   For EACH day, provide a timeline (e.g., "09:00 AM - Breakfast at [Specific Cafe Name]").
        -   Include **Travel Time** between locations.
        -   Mention **Entry Fees** for attractions.
        -   Suggest **Specific Restaurants** for Lunch/Dinner with must-try dishes.
    
    5.  **Hidden Gems & Pro Tips**:
        -   Lesser-known spots near their destination.
        -   Scams to avoid.
        -   Cultural etiquette.
    
    6.  **Packing Checklist**:
        -   Tailored to the weather and activities.
    
    Format the final plan in clean Markdown. Use **Bold** for emphasis and Tables for budgets.`;

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    newTripBtn.addEventListener('click', () => {
        if (confirm('Start a new trip plan? This will clear current conversation.')) {
            conversationHistory = [];
            chatContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="avatar">AI</div>
                    <div class="content">
                        Hello! I'm move.ai, your personal travel assistant. I can help you plan your perfect trip. Where are you dreaming of going?
                    </div>
                </div>`;
            itineraryOverlay.classList.add('hidden');
        }
    });

    closeItineraryBtn.addEventListener('click', () => {
        itineraryOverlay.classList.add('hidden');
    });

    // Functions
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';

        // Add Loading Indicator
        const loadingId = addLoadingIndicator();

        try {
            const response = await fetchAIResponse(text);
            removeLoadingIndicator(loadingId);

            // Check for Final Plan trigger
            if (response.includes('### TRIP PLAN ###')) {
                const planContent = response.replace('### TRIP PLAN ###', '').trim();
                addMessage("I've generated your complete trip plan! Click below to view it.", 'bot');
                showItinerary(planContent);
            } else {
                addMessage(response, 'bot');
            }
        } catch (error) {
            removeLoadingIndicator(loadingId);
            addMessage("Sorry, I encountered an error. Please check your API key or try again.", 'bot');
            console.error(error);
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'bot' ? 'AI' : 'You';

        const content = document.createElement('div');
        content.className = 'content';

        // Simple markdown parsing for chat messages (bold, italic)
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        content.innerHTML = formattedText;

        div.appendChild(avatar);
        div.appendChild(content);

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.className = 'message bot-message';
        div.id = id;
        div.innerHTML = `
            <div class="avatar">AI</div>
            <div class="content">
                <span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span>
            </div>
        `;
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }

    function removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function fetchAIResponse(userMessage) {
        if (!API_KEY || API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
            addMessage("Please set your API Key in script.js", 'bot');
            throw new Error('No API Key configured');
        }

        // Prepare messages
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href, // Required by OpenRouter
                'X-Title': 'move.ai' // Optional
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo', // Or any other model available on OpenRouter
                messages: messages
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Error');
        }

        const data = await response.json();
        const botText = data.choices[0].message.content;

        // Update History
        conversationHistory.push({ role: 'user', content: userMessage });
        conversationHistory.push({ role: 'assistant', content: botText });

        return botText;
    }

    function showItinerary(markdownContent) {
        // Use marked.js to render markdown
        itineraryBody.innerHTML = marked.parse(markdownContent);
        itineraryOverlay.classList.remove('hidden');

        // Add a "View Itinerary" button to the chat if closed
        const viewBtn = document.createElement('button');
        viewBtn.className = 'primary-btn';
        viewBtn.style.marginTop = '10px';
        viewBtn.textContent = 'Open Itinerary Again';
        viewBtn.onclick = () => itineraryOverlay.classList.remove('hidden');

        // Append to last message content
        const lastMsg = chatContainer.lastElementChild.querySelector('.content');
        if (lastMsg) lastMsg.appendChild(viewBtn);
    }

    // Auto-resize textarea
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});
