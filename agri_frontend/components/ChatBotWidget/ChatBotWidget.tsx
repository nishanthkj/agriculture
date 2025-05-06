'use client'

import { useEffect, useState } from 'react'

interface Message {
  sender: string
  text: string
}

interface User {
  name: string
  email: string
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [soilData, setSoilData] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/profile', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        setUser(data.user)
        setMessages([
          {
            sender: 'AgriBot',
            text: `🌿 Hi ${data.user.name}, I’m AgriBot — your agriculture assistant! Ask me anything about crops, soil, or farming.`,
          },
        ])
      } catch {
        console.log('User not logged in')
        setMessages([
          {
            sender: 'AgriBot',
            text: '🌾 Welcome! Please login to ask agriculture-related questions.',
          },
        ])
      }
    }

    const fetchSoil = async () => {
      try {
        const res = await fetch('/api/soil', { credentials: 'include', cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setSoilData(data)
        }
      } catch {
        setSoilData(null)
      }
    }

    fetchUser()
    fetchSoil()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || !user) return

    const userMsg = { sender: user.name, text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input,
          soilData,
          userName: user.name,
        }),
      })

      const data = await res.json()
      setMessages(prev => [...prev, { sender: 'AgriBot', text: data.response }])
    } catch {
      setMessages(prev => [...prev, { sender: 'AgriBot', text: '❌ Error: Unable to respond. Please try again.' }])
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-700 text-white px-4 py-2 rounded-full shadow-lg"
      >
        🌱 AgriBot
      </button>

      {isOpen && (
        <div className="mt-2 w-80 h-96 bg-white dark:bg-black border border-gray-300 dark:border-white/20 rounded-lg shadow-lg flex flex-col">
          <div className="p-2 text-sm font-semibold border-b">🧑‍🌾 AgriBot Assistant</div>
          <div className="flex-1 p-2 overflow-y-auto text-sm space-y-1">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === 'AgriBot' ? 'text-left' : 'text-right'}>
                <span className="inline-block px-2 py-1 rounded bg-muted dark:bg-gray-700 text-black dark:text-white">
                  <b>{msg.sender}:</b> {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            {user ? (
              <>
                <input
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about soil, crops, seasons..."
                />
                <button onClick={handleSend} className="ml-2 px-2 py-1 text-sm bg-green-700 text-white rounded">
                  Send
                </button>
              </>
            ) : (
              <div className="text-red-500 text-sm">
                Please <a href="/login" className="underline">login</a>.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
