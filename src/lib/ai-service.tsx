"use server";

import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { PropertyType } from "@/lib/types";
import { mockProperties } from "./mock-data";

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
  chatHistory = ""
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

    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
}

export default async function getAIResponse({
  userMessage = "",
  chatHistory = "",
}) {
  try {
    if (!userMessage) {
      return "Please provide a message to the AI assistant.";
    }
    if (chatHistory && typeof chatHistory !== "string") {
      return "Unexplained error";
    }

    try {
      return await generateAIResponse(userMessage, chatHistory);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "Error generating AI response";
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return "Internal server error";
  }
}

// Function to check fields
function checkFields() {}

// Check the fields of the route handlers
checkFields();
