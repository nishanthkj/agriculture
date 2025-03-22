'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || 'Sign up failed')
      return
    }

    toast.success('Signed up and logged in!')
    router.push('/dashboard') // ✅ Redirect after successful signup
  }

  // ✅ Redirect if already logged in
  useEffect(() => {
    const check = async () => {
      const res = await fetch('/api/auth/profile')
      if (res.ok) router.push('/dashboard')
    }
    check()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold text-center">Sign Up</h2>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input name="password" type="password" onChange={handleChange} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Sign Up
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
