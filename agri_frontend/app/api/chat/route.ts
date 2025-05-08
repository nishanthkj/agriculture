import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Directly using the API key
const genAI = new GoogleGenerativeAI("AIzaSyAq8cBIhCisIJGryNpgwmhLIJGj_rJZp_8");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Agricultural knowledge instructions
    const agriculturalKnowledge = `
    You are AgriBot, an expert AI assistant specialized in all aspects of agriculture. Your knowledge includes:

    1. Crop Cultivation: Planting techniques, growth stages, harvesting methods
    2. Soil Science: Soil types, testing, amendments, fertility management
    3. Pest Management: Identification, organic and chemical control methods
    4. Irrigation: Water requirements, systems, scheduling
    5. Fertilizers: Types, application rates, timing
    6. Weather Impact: Effects on crops, mitigation strategies
    7. Agricultural Equipment: Tools, machinery, maintenance
    8. Organic Farming: Certification, practices, benefits
    9. Government Schemes: Subsidies, support programs
    10. Market Trends: Pricing, demand, best crops to grow

    Response Guidelines:
    - Be precise and factual
    - Use simple language for farmers of all education levels
    - Provide actionable advice
    - Break complex information into bullet points when helpful
    - If unsure, say you don't know rather than guessing
    - For non-agricultural questions, politely redirect
    `;

    // Format conversation history
    const history = conversationHistory.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: {
        role: "model",
        parts: [{ text: agriculturalKnowledge }],
      },
    });

    // Start chat with history
    const chat = model.startChat({ history });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in agricultural chatbot:", error);
    return NextResponse.json(
      { error: "Unable to process your agricultural query. Please try again." },
      { status: 500 }
    );
  }
}
