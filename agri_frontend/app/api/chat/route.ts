import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Enhanced Type definitions
interface ChatRequest {
  message: string
  userName: string
  soilData?: Record<string, number>
  location?: string
  cropType?: string
}

interface ChatResponse {
  response: string
  relatedTopics?: string[]
}

interface ErrorResponse {
  error: string
  details?: string
}

// Initialize Gemini AI with safety settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
})

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    const body: ChatRequest = await req.json()
    console.log('📥 Incoming /api/chat request:', JSON.stringify(body, null, 2))

    const { message, soilData, userName, location, cropType } = body

    // Validate request body
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!userName?.trim()) {
      return NextResponse.json(
        { error: 'userName is required' },
        { status: 400 }
      )
    }

    // Create the enhanced prompt
    const prompt = `
    You are AgriBot 🌾, an expert AI assistant for all agriculture-related topics including:
    - Soil fertility and analysis
    - Crop yield predictions
    - Market price trends
    - Pest and disease identification
    - Farming techniques
    - Weather impacts on agriculture
    - Sustainable farming practices

    User Context:
    - Name: ${userName}
    ${location ? `- Location: ${location}` : ''}
    ${cropType ? `- Crop Type: ${cropType}` : ''}
    ${soilData ? `- Soil Data: ${formatSoilData(soilData)}` : ''}

    Current Question: "${message}"

    Response Guidelines:
    1. Provide accurate, practical agricultural advice
    2. Keep responses concise (2-3 sentences)
    3. Use simple language suitable for farmers
    4. Include relevant emojis
    5. For predictions, indicate confidence level
    6. Suggest preventive measures for pests/diseases
    7. Mention local considerations if location provided

    Examples of good responses:
    - "For your rice crop in ${location || 'your region'}, common pests are brown plant hoppers 🦗. Apply neem oil weekly as prevention."
    - "Current wheat prices are ₹2,100/quintal 📈, expected to rise 5% next month."
    - "Your soil pH of ${soilData?.pH || 'X'} is ideal for tomatoes 🍅. Add compost for better yield."

    Now provide your expert response:
    `.trim()

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 350,
      }
    })

    const response = await result.response
    const text = response.text()

    if (!text) {
      throw new Error('Empty response from Gemini API')
    }

    // Generate related topics
    const relatedTopics = await generateRelatedTopics(message)

    console.log('✅ Generated response:', text)

    return NextResponse.json({ 
      response: text,
      ...(relatedTopics.length > 0 && { relatedTopics })
    })

  } catch (error: unknown) {
    console.error('❌ Chat API Error:', error)
    
    const userFriendlyError = "Sorry, I'm having trouble answering right now. 🌧️ Please try again later."
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: userFriendlyError,
        ...(process.env.NODE_ENV === 'development' && { details: errorDetails })
      },
      { status: 500 }
    )
  }
}

// Helper functions
function formatSoilData(data: Record<string, number>): string {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}

async function generateRelatedTopics(question: string): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `
    Based on this agricultural question: "${question}"
    Suggest 3 related topics farmers might want to know about.
    Return as a JSON array of strings.
    
    Example: ["Pest control methods", "Optimal planting season", "Soil nutrient management"]
    `.trim()

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 150
      }
    })

    const response = await result.response.text()
    return JSON.parse(response) as string[]
  } catch {
    return [] // Return empty if fails
  }
}