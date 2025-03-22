'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })

  // ✅ Auto-redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          credentials: 'include',
        })

        if (res.ok) {
          // Token is valid → redirect to homepage
          router.push('/')
        }
      } catch (err) {
        console.error('Token check failed', err)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || 'Login failed')
      return
    }

    toast.success('Login successful')
    router.push('/profile')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold text-center">Login</h2>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" onChange={handleChange} />
          </div>
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
