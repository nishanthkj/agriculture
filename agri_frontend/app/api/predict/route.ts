import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

interface PestPredictionRequest {
  message: string
  cropType: string
  location: string
  observedSymptoms?: string[]
  growthStage?: string
  weather?: string
}

interface PestPredictionResponse {
  prediction: string
  confidenceLevel: string
  preventionMethods: string[]
  treatmentOptions: string[]
  relatedPests?: string[]
}

interface ErrorResponse {
  error: string
  details?: string
}

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

export async function POST(req: NextRequest): Promise<NextResponse<PestPredictionResponse | ErrorResponse>> {
  try {
    const body: PestPredictionRequest = await req.json()
    const { message, cropType, location, observedSymptoms, growthStage, weather } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Description of the problem is required' }, { status: 400 })
    }

    if (!cropType?.trim()) {
      return NextResponse.json({ error: 'Crop type is required' }, { status: 400 })
    }

    if (!location?.trim()) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 })
    }

    const prompt = `
You are AgriPestExpert 🐛🔍, an AI for predicting agricultural pests and offering treatment.

Context:
- Crop: ${cropType}
- Location: ${location}
${growthStage ? `- Growth Stage: ${growthStage}` : ''}
${weather ? `- Weather: ${weather}` : ''}
${observedSymptoms ? `- Observed Symptoms: ${observedSymptoms.join(', ')}` : ''}

User says: "${message}"

Respond ONLY in JSON format, no extra explanation.
Format:
{
  "prediction": "Example Pest Name",
  "confidenceLevel": "High",
  "preventionMethods": ["method1", "method2", "method3"],
  "treatmentOptions": ["treatment1", "treatment2"]
}
`.trim()

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 500,
      }
    })

    const rawText = await result.response.text()
    console.log('🧠 Gemini raw output:', rawText)

    const jsonOnly = extractJSONBlock(rawText)
    const predictionResponse = parsePestResponse(jsonOnly)

    const relatedPests = await generateRelatedPests(cropType, location)

    return NextResponse.json({
      ...predictionResponse,
      ...(relatedPests.length > 0 && { relatedPests })
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error('❌ Pest Prediction Error:', err.message)
    return NextResponse.json({
      error: "Sorry, I'm having trouble identifying pests. 🐜 Try again soon.",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    }, { status: 500 })
  }

function extractJSONBlock(text: string): string {
  const match = text.match(/\{[\s\S]*?\}/)
  return match ? match[0] : ''
}

function parsePestResponse(text: string): Omit<PestPredictionResponse, 'relatedPests'> {
  try {
    return JSON.parse(text)
  } catch {
    return {
      prediction: 'Unknown Pest',
      confidenceLevel: 'Low',
      preventionMethods: ['No clear prevention available.'],
      treatmentOptions: ['Try contacting a local agri expert.'],
    }
  }
}

async function generateRelatedPests(cropType: string, location: string): Promise<string[]> {
  try {
    const prompt = `
List 3-5 common pests for ${cropType} in ${location}. Respond as a JSON array.

Example: ["Brown Plant Hopper", "Rice Stem Borer"]
    `.trim()

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 150,
      }
    })

    const response = await result.response.text()
    return JSON.parse(response)
  } catch {
    return []
  }
}
}
