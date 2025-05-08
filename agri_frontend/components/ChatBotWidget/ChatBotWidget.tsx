'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2, Send, Bot, User } from 'lucide-react'

interface Message {
  sender: 'user' | 'AgriBot'
  text: string
  timestamp: Date
}

interface User {
  name: string
  email: string
}

interface SoilData {
  pH?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  moisture?: number
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [soilData, setSoilData] = useState<SoilData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample agricultural questions for quick start
  const sampleQuestions = [
    "What crops grow best in my soil type?",
    "How to improve soil fertility?",
    "Best pest control methods for organic farming",
    "When should I harvest my crops?"
  ]

  // Fetch user and soil data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch('/api/auth/profile', { credentials: 'include' })
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData.user)
          
          // Initial bot greeting
          setMessages([{
            sender: 'AgriBot',
            text: `🌿 Hello ${userData.user.name}! I'm AgriBot, your agricultural assistant. How can I help you today?`,
            timestamp: new Date()
          }])
        } else {
          setMessages([{
            sender: 'AgriBot',
            text: '🌾 Welcome! Please log in to get personalized agricultural advice.',
            timestamp: new Date()
          }])
        }

        // Fetch soil data
        const soilRes = await fetch('/api/soil', { 
          credentials: 'include', 
          cache: 'no-store' 
        })
        if (soilRes.ok) {
          const soilData = await soilRes.json()
          setSoilData(soilData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return

    // Add user message
    const userMsg: Message = { 
      sender: 'user', 
      text: input, 
      timestamp: new Date() 
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Send to API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input,
          soilData,
          userName: user.name,
          conversationHistory: messages
            .filter(m => m.sender === 'user')
            .map(m => ({ role: m.sender, content: m.text }))
        }),
      })

      if (!res.ok) throw new Error('API response not OK')

      const { response } = await res.json()
      const botMsg: Message = { 
        sender: 'AgriBot', 
        text: response, 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg: Message = { 
        sender: 'AgriBot', 
        text: '⚠️ Sorry, I encountered an error. Please try again later.', 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${isOpen ? 'bg-green-800' : 'bg-green-700 hover:bg-green-600'}`}
        aria-label="Open AgriBot"
      >
        {isLoading && isOpen ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : (
          <Bot className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-[28rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">AgriBot Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Loading AgriBot...
              </div>
            ) : (
              messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 flex flex-col ${msg.sender === 'user' 
                      ? 'bg-green-100 dark:bg-green-900 text-gray-800 dark:text-gray-200' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium text-xs">
                        {msg.sender === 'user' ? user?.name : 'AgriBot'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
            {user ? (
              <>
                {/* Sample questions */}
                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sampleQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(question)}
                        className="text-xs px-2 py-1 bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-300 rounded-full hover:bg-green-100 dark:hover:bg-gray-600"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input field */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about crops, soil, weather..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-sm text-red-500 dark:text-red-400">
                Please <a href="/login" className="underline font-medium">log in</a> to chat with AgriBot
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}