import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Log the incoming request for email and password
    console.log('Login attempt with email:', email)

    // Check if email and password are provided
    if (!email || !password) {
      console.log('Error: Email or password missing')
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Log user existence check
    if (!user) {
      console.log('User not found for email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Compare the provided password with the stored hashed password
    console.log('Comparing provided password with stored password...')
    const isPasswordValid = await comparePassword(password, user.password)

    // Log the result of the password comparison
    if (!isPasswordValid) {
      console.log('Invalid password for email:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('Password valid for email:', email)

    // ✅ Generate JWT token
    const token = generateToken({ id: user.id, email: user.email ,role:user.role })
    console.log('Generated JWT token:', token)

    // Set the token in HttpOnly cookies (server-side)
    const cookieStore = await cookies() // Await cookies() to get the correct object
    await cookieStore.set('token', token, {
      httpOnly: true, // Ensures that the cookie is not accessible via JavaScript
      path: '/', // Path to make the cookie accessible throughout the site
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
    })

    console.log('Token set in cookies for user:', email)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
