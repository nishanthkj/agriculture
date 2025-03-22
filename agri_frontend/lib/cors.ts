import { NextRequest, NextResponse } from 'next/server'

export function handleCors(req: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*', // ✅ Allow all origins
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  }

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers
    })
  }

  return headers
}
// Compare this snippet from app/api/auth/signup/route.ts:
// import { NextRequest, NextResponse } from 'next/server'