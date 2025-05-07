import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 Incoming /api/chat request:', body);

    const { message, soilData, userName } = body;

    // Check for required fields in the request body
    if (!message || !userName) {
      return NextResponse.json({ error: 'Missing message or userName' }, { status: 400 });
    }

    // Create the prompt for the generative AI
    const prompt = `
    You are Agri Bot 🌿, a helpful assistant for farmers and agriculture students.

    User: ${userName}
    Soil Data: ${JSON.stringify(soilData || {})}
    Question: ${message}

    Respond in a short and friendly way, like a chat. Be helpful and to the point!
    `.trim();

    let response = '';

    // Try to generate the response using the Google Gemini model
    try {
      // Send the request to the Gemini API
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Specify the model
        contents: prompt, // Provide the prompt to the model
      });

      // Check the response for the generated text
      if (geminiResponse.text) {
        response = geminiResponse.text;
        console.log('✅ Gemini Response:', response);
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (geminiError) {
      console.error('⚠️ Error during Gemini API request:', geminiError);
      response = 'Oops, something went wrong! Let me try again.';
    }

    // Return the generated response
    return NextResponse.json({ response });
  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json({ error: 'Something went wrong in the chat API.' }, { status: 500 });
  }
}
