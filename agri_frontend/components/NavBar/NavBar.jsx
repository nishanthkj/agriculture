'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaEnvelope,
  FaInfoCircle,
  FaCogs,
} from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export default function ResponsiveNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/profile', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setUser(data.user)
      } catch {
        console.log('User not logged in')
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return (
    <nav className="bg-transparent shadow-md font-poppins">
      <div className="mx-auto max-w-[1100px] px-6 flex items-center justify-between h-16">
        <div className="text-lg font-bold text-black">Neuro Kodes</div>

        {/* Hamburger Menu (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black hover:text-blue-600 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 text-black items-center">
          <li className="flex items-center"><FaHome className="mr-2" /><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li className="flex items-center"><FaCogs className="mr-2" /><Link href="/services" className="hover:text-blue-600">Services</Link></li>
          <li className="flex items-center"><FaUsers className="mr-2" /><Link href="/managing" className="hover:text-blue-600">Managing</Link></li>
          <li className="flex items-center"><FaEnvelope className="mr-2" /><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          <li className="flex items-center"><FaInfoCircle className="mr-2" /><Link href="/about" className="hover:text-blue-600">About</Link></li>
        </ul>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-4 space-y-3">
                <div
                  className="text-center cursor-pointer hover:bg-muted rounded p-2"
                  onClick={() => router.push('/profile')}
                >
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
                <hr />
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </PopoverContent>

            </Popover>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-100 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100 shadow-md">
          <ul className="space-y-4 py-4 px-6 text-black">

            {/* User Info Top in Mobile */}
            {user && (
              <div
                className="mb-4 border-b border-gray-300 pb-3 px-4 py-2 text-center rounded-md cursor-pointer transition-colors hover:bg-grey-400 hover:text-green-800"

                onClick={() => {
                  setIsMenuOpen(false)
                  router.push('/profile')
                }}
              >
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            )}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Menu Links */}
              <li className="flex items-center"><FaHome className="mr-2" /><Link href="/">Home</Link></li>
              <li className="flex items-center"><FaCogs className="mr-2" /><Link href="/services">Services</Link></li>
              <li className="flex items-center"><FaUsers className="mr-2" /><Link href="/managing">Managing</Link></li>
              <li className="flex items-center"><FaEnvelope className="mr-2" /><Link href="/contact">Contact</Link></li>
              <li className="flex items-center"><FaInfoCircle className="mr-2" /><Link href="/about">About</Link></li>
            </div>
            {/* Auth Buttons Bottom in Mobile */}
            <div className="space-y-4 mt-6">
              {!user ? (
                <>
                  <Link href="/login" className="block px-4 py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-100 transition">
                    Login
                  </Link>
                  <Link href="/signup" className="block px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition">
                    Sign Up
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full text-left text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  )
}
