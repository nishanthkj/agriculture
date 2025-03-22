import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'



export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      userId,
      nitrogen,
      phosphorous,
      potassium,
      ph,
      rainfall,
      state,
      city
    } = body

    // Validate required fields
    if (!userId || !nitrogen || !phosphorous || !potassium || !ph || !rainfall || !state || !city) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const soilEntry = await prisma.soilData.create({
      data: {
        userId,
        nitrogen: parseFloat(nitrogen),
        phosphorous: parseFloat(phosphorous),
        potassium: parseFloat(potassium),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
        state,
        city
      }
    })

    return NextResponse.json({ success: true, data: soilEntry }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
