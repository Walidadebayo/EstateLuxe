import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { mockProperties } from "../../../lib/mock-data"; // Import mock properties
import { PropertyType } from "@/lib/types";

// Initialize the Google Generative AI model (Gemini) with API key
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const google = createGoogleGenerativeAI({
  apiKey: API_KEY,
});
const gemini = google("gemini-1.5-flash");

// Function to parse mock property data
function parseProperties(properties: PropertyType[]) {
  return properties
    .map((property) => {
      return `
        Property Name: ${property.name}
        Location: ${property.location}
        Price: $${property.price}
        Bedrooms: ${property.bedrooms}
        Bathrooms: ${property.bathrooms}
        Sqft: ${property.sqft}
        Type: ${property.type}
        Status: ${property.status}
        Description: ${property.description}
        Features: ${property.features.join(", ")}
        Latitude: ${property.latitude}
        Longitude: ${property.longitude}
        `;
    })
    .join("\n");
}

// System prompt to provide context about the real estate assistant
const SYSTEM_PROMPT = `
You are EstateLuxeAI, a helpful real estate assistant for the Estate Management System.
Your role is to help users find properties, provide real estate advice, calculate mortgage payments, and answer questions about real estate.

You have access to property listings with the following information:
Use this format to describe properties and provide recommendations (see it as a real estate database)
${parseProperties(mockProperties)}

When users ask about properties, provide helpful and concise information.
When recommending properties, focus on the user's preferences if mentioned.
For mortgage calculations, use standard formulas and explain the results clearly.
Provide practical real estate advice based on common best practices.

Keep responses conversational, helpful, and focused on real estate topics.
`;
export async function generateAIResponse(
  userMessage: string,
  chatHistory = "",
) {
  try {
    const prompt = `
        system: ${SYSTEM_PROMPT}
        chatHistory: ${chatHistory}
        User: ${userMessage}
        EstateLuxeAI:`;

    const response = await generateText({
      model: gemini,
      prompt,
      system: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 800,
    });

    const aiResponse = response.text;

    return { text: aiResponse };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      text: "I'm sorry, I encountered an error while processing your request. Please try again.",
      properties: [],
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userMessage, chatHistory } = await req.json();
    if (!userMessage) {
      return new NextResponse("User message is required", { status: 400 });
    }
    if (chatHistory && typeof chatHistory !== "string") {
      return new NextResponse("Chat history must be a string", { status: 400 });
    }

    try {
      const { text } = await generateAIResponse(userMessage, chatHistory);
      return new NextResponse(JSON.stringify({ response: text }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      return new NextResponse("Error generating AI response", { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
