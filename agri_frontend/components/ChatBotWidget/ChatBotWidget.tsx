'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User as UserIcon, LogIn } from 'lucide-react'

interface Message {
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface User {
  name: string
  email: string
  avatar?: string
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [soilData, setSoilData] = useState<Record<string, number> | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/auth/profile', { credentials: 'include' })
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData.user)
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              text: `🌿 Hi ${userData.user.name}, I'm AgriBot — your agriculture assistant! Ask me anything about crops, soil, or farming.`,
              timestamp: new Date()
            }
          ])
        } else {
          setMessages([
            {
              sender: 'bot',
              text: '🌾 Welcome! Please login to get personalized agriculture advice.',
              timestamp: new Date()
            }
          ])
        }

        const soilRes = await fetch('/api/soil', { credentials: 'include', cache: 'no-store' })
        if (soilRes.ok) {
          const soilData = await soilRes.json()
          setSoilData(soilData)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input,
          soilData,
          userName: user?.name || 'Guest'
        }),
      })

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.response,
          timestamp: new Date()
        }
      ])
    } catch (err) {
      console.error('Chat API error:', err)
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '❌ Error: Unable to respond. Please try again later.',
          timestamp: new Date()
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
          isOpen ? 'bg-green-700' : 'bg-green-600'
        } text-white`}
        aria-label="AgriBot Chat"
      >
        <Bot className="w-6 h-6" />
        {messages.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-80 h-[28rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-green-600 text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">AgriBot Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-700">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-3 py-2 ${
                      msg.sender === 'bot'
                        ? 'bg-green-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                        : 'bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.sender === 'bot' ? (
                        <Bot className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                      ) : (
                        <UserIcon className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                      )}
                      <span className="text-xs font-medium">
                        {msg.sender === 'bot' ? 'AgriBot' : user?.name || 'You'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex justify-start"
                >
                  <div className="bg-green-100 dark:bg-gray-600 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              {user ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex space-x-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ask about crops, soil, weather..."
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg px-3 py-2 text-sm transition-colors"
                  >
                    Send
                  </button>
                </form>
              ) : (
                <div className="text-center p-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Please login to chat with AgriBot
                  </div>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
