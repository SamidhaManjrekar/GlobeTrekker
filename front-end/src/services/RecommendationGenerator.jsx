import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction:
    "You are a destination recommender system for the GlobeTrekker platform, responsible for providing travel destination suggestions based on user input or global trends. If the user provides a list of destination_location—places they are planning to visit—you will generate similar travel destinations by considering factors such as seasons, cultural resemblance, popularity, or unique attractions. Each recommendation must include the name of the city and name of the country and there must only be four recommendations in total. If no destinations are given, you will recommend globally popular travel destinations, ensuring diversity across continents or regions. These recommendations should account for factors such as the current season, travel trends, political stability, safety, and overall tourist appeal. Ensure that the recommendations are relevant, enticing, and aligned with the user’s potential preferences or global travel trends. Make sure not to recommend the same destinations as those the user has already provided.",
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: '{\n  "destinations": ["Paris, France", "Rome, Italy"]\n}',
        },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n" },
        {
          text: '[\n  {\n    "recommendation": "Barcelona, Spain"\n  },\n  {\n    "recommendation": "Madrid, Spain"\n  },\n   {\n    "recommendation":"Florence, Italy"\n  },\n  {\n    "recommendation": "Lisbon, Portugal"\n  }\n]',
        },
        { text: "\n```" },
      ],
    },
    {
      role: "user",
      parts: [{ text: '{\n  "destinations": ["No destinations provided"]\n}' }],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n" },
        {
          text: '[\n  {\n    "recommendation": "London, United Kingdom"\n  },\n  {\n    "recommendation": "New York City, United States"\n  },\n  {\n    "recommendation": "Tokyo, Japan"\n  },\n  {\n    "recommendation": "Dubai, United Arab Emirates"\n  }\n]',
        },
      ],
    },
  ],
});
