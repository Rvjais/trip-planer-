const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = "http://localhost:5173";
const SITE_NAME = "TripPlanner.ai";

export const generateItinerary = async (formData) => {
    const { destination, startDate, endDate, minBudget, maxBudget, interests, prompt } = formData;

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const userPrompt = `
    Plan a ${diffDays}-day trip to ${destination} from ${startDate} to ${endDate}.
    Budget: ${minBudget} - ${maxBudget} (Currency: assume local or USD).
    Interests: ${interests.join(', ')}.
    Special Instructions: ${prompt || "None"}.

    Act as a local expert travel planner. Your goal is to provide a highly detailed, logistical, and authentic itinerary.
    
    CRITICAL: You MUST also provide 3 specific hotel recommendations (Budget, Mid-range, Luxury) with prices.

    For every activity in the itinerary, you MUST include:
    1. Exact transport details.
    2. Specific food recommendations.
    3. Practical tips.

    Generate the response in strictly valid JSON format.
    Structure:
    {
      "hotels": [
        { 
          "name": "Hotel Name", 
          "category": "Budget/Mid/Luxury", 
          "price": "$X per night", 
          "rating": "4.5", 
          "description": "Brief review.",
          "booking_link": "https://www.booking.com/searchresults.html?ss=Hotel+Name"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "activities": [
            { 
              "time": "09:00 AM", 
              "activity": "Name", 
              "description": "Details",
              "transport": "How to get there",
              "food": "Where to eat",
              "type": "Category" 
            }
          ]
        }
      ]
    }
    Ensure the response is ONLY the JSON object, no markdown formatting or backticks.
  `;

    const generateWithModel = async (modelName) => {
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
                    "messages": [
                        {
                            "role": "user",
                            "content": userPrompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.warn(`Failed with model ${modelName}:`, error);
            return null;
        }
    };

    try {
        // List of models to try in order of preference
        const modelsToTry = [
            "google/gemini-2.0-flash-exp:free",
            "google/gemini-flash-1.5",
            "openai/gpt-4o-mini",
            "meta-llama/llama-3.1-70b-instruct:free"
        ];

        let text = null;

        for (const modelName of modelsToTry) {
            console.log(`Attempting to generate with model: ${modelName}`);
            text = await generateWithModel(modelName);
            if (text) break; // Success!
        }

        if (!text) {
            throw new Error("Failed to generate itinerary. Please check your API key or internet connection.");
        }

        // Clean up potential markdown code blocks if the model adds them
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const itinerary = JSON.parse(cleanJson);

        // Attach prompt for display purposes
        itinerary.prompt = prompt;

        return itinerary;
    } catch (error) {
        console.error("Error generating itinerary:", error);
        throw new Error("Failed to generate itinerary. Please try again.");
    }
};
