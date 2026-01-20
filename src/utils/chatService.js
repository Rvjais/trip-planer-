const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = "http://localhost:5173"; // Default Vite local URL
const SITE_NAME = "TripPlanner.ai";

const SYSTEM_INSTRUCTION = `
You are a helpful and enthusiastic travel assistant. Your goal is to gather the following information from the user to plan their trip:
1. Destination
2. Start Date and End Date (or duration)
3. Budget (Low, Medium, High, or specific range)
4. Interests (e.g., Food, Adventure, History)

Interact with the user naturally. Ask one or two questions at a time. Do not be repetitive.
If the user gives a vague answer, ask for clarification.

CRITICAL:
Every time you respond, check if you have ALL 4 pieces of information.
If you DO have all 4, you MUST append a special JSON block to the END of your response.
The JSON block must look EXACTLY like this:
\`\`\`json
{
  "COMPLETE": true,
  "destination": "Paris",
  "startDate": "2023-10-01",
  "endDate": "2023-10-05",
  "minBudget": 1000,
  "maxBudget": 2000,
  "interests": ["Food", "Art"],
  "prompt": "User's full original request/summary"
}
\`\`\`
If you do NOT have all information, do NOT include this JSON block. Just continue the conversation.
For dates, infer the year as current or next year if not specified. Convert relative dates (like "next week") to YYYY-MM-DD.
For budget, if they say "cheap", estimate a low range. If "luxury", estimate high.
`;

export const sendChatMessage = async (history, newMessage) => {
    // OpenRouter uses OpenAI-compatible message format
    // History comes in as { role: 'user'|'model', parts: [{text: '...'}] }
    // We need to convert it to { role: 'user'|'assistant', content: '...' }

    const formattedHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text
    }));

    // Add system instruction as the first message
    const messages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...formattedHistory,
        { role: 'user', content: newMessage }
    ];

    const modelsToTry = [
        "google/gemini-2.0-flash-exp:free",
        "google/gemini-flash-1.5",
        "openai/gpt-4o-mini",
        "meta-llama/llama-3.1-70b-instruct:free"
    ];

    for (const modelName of modelsToTry) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": SITE_URL,
                    "X-Title": SITE_NAME,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": modelName,
                    "messages": messages
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.choices[0].message.content;

            // Check for the extraction JSON
            const jsonMatch = text.match(/```json\s*({[\s\S]*?})\s*```/);

            let extractedData = null;
            let cleanText = text;

            if (jsonMatch) {
                try {
                    const json = JSON.parse(jsonMatch[1]);
                    if (json.COMPLETE) {
                        extractedData = json;
                        // Remove the JSON from the user-facing text
                        cleanText = text.replace(jsonMatch[0], '').trim();
                    }
                } catch (e) {
                    console.error("Failed to parse extraction JSON", e);
                }
            }

            return {
                text: cleanText,
                data: extractedData
            };

        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error);
            // Continue to next model
        }
    }

    return {
        text: "I'm having trouble connecting to the travel network. Please check your internet connection.",
        data: null
    };
};
