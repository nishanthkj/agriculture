import { NextRequest, NextResponse } from 'next/server'
import { pipeline } from '@xenova/transformers'
import type { TextGenerationPipeline } from '@xenova/transformers'

let generator: TextGenerationPipeline | null = null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📥 Incoming /api/chat request:', body)

    const { message, soilData, userName } = body

    if (!message || !userName) {
      return NextResponse.json({ error: 'Missing message or userName' }, { status: 400 })
    }

    const prompt = `
You are Agri Bot 🌿, a helpful assistant for farmers and agriculture students.

User: ${userName}
Soil Data: ${JSON.stringify(soilData || {})}
Question: ${message}

Give a clear, helpful, and practical response.
`.trim()

    let response = ''

    // Try local LLM using Xenova's deepseek-llm-3b-base
    try {
      if (!generator) {
        generator = await pipeline('text-generation', 'Xenova/deepseek-llm-3b-base')
      }

      const output = await generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.9,
        do_sample: true,
      })

      if (Array.isArray(output) && output.length > 0 && 'generated_text' in output[0]) {
        const generatedText = output[0].generated_text as string;
        response = generatedText.replace(prompt, '').trim()
        console.log('✅ Local LLM Response:', response)
      } else {
        throw new Error('Invalid local LLM output')
      }
    } catch (localError) {
      console.warn('⚠️ Local LLM failed. Falling back to Gemini.', localError)

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )

      const data = await geminiRes.json()
      response =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not generate a response.'
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('❌ Chat API Error:', error)
    return NextResponse.json({ error: 'Something went wrong in the chat API.' }, { status: 500 })
  }
}
