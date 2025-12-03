import { GoogleGenAI } from "@google/genai";
import { Customer, Product } from "../types";

// Fallback data if API key is missing or fails
const FALLBACK_CUSTOMERS: Customer[] = [
  {
    id: "fb1",
    name: "Maria Santos",
    avatar: "https://picsum.photos/seed/maria/200",
    dialogue: "Oi! Apenas um café e um croissant, por favor.",
    desiredItems: [
      { id: "p1", name: "Expresso", price: 4.50 },
      { id: "p2", name: "Croissant", price: 5.00 }
    ]
  },
  {
    id: "fb2",
    name: "João Silva",
    avatar: "https://picsum.photos/seed/joao/200",
    dialogue: "Preciso almoçar. Talvez um sanduíche e um refrigerante.",
    desiredItems: [
      { id: "p3", name: "Sanduíche de Presunto", price: 12.00 },
      { id: "p4", name: "Refrigerante", price: 4.00 }
    ]
  }
];

export const generateCustomerScenario = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Customer> => {
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found, using fallback customer data.");
    return FALLBACK_CUSTOMERS[Math.floor(Math.random() * FALLBACK_CUSTOMERS.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash for speed as recommended
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Generate a random customer for a shop simulation game.
      Difficulty: ${difficulty}.
      Language: Portuguese (Brazil).
      Return JSON with:
      - name (string, Portuguese names)
      - dialogue (string, a short greeting asking for specific items in Portuguese)
      - desiredItems (array of objects with name (in Portuguese) and price. Price should be a number. 2-5 items.)
      
      Example format:
      {
        "name": "Alice",
        "dialogue": "Oi, eu gostaria de um café.",
        "desiredItems": [{"name": "Café", "price": 3.50}]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const data = JSON.parse(text);
    
    // Map to our internal Customer type, adding IDs and avatars
    return {
      id: `ai_${Date.now()}`,
      name: data.name,
      avatar: `https://picsum.photos/seed/${data.name.replace(' ', '')}/200`,
      dialogue: data.dialogue,
      desiredItems: data.desiredItems.map((item: any, idx: number) => ({
        id: `gen_${idx}`,
        name: item.name,
        price: Number(item.price)
      }))
    };

  } catch (error) {
    console.error("AI Generation failed:", error);
    return FALLBACK_CUSTOMERS[Math.floor(Math.random() * FALLBACK_CUSTOMERS.length)];
  }
};