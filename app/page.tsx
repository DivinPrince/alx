'use client'

import { useState, useRef, useEffect } from 'react'
import { useActionState } from 'react'
import { generateCode } from './actions'
import ReactMarkdown from 'react-markdown'
import { FiCopy } from 'react-icons/fi'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const MessageBubble = ({ message }: { message: Message }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('Failed to copy text: ', err)
    })
  }

  return (
    <div
      className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
    >
      <div
        className={`inline-block p-4 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <ReactMarkdown
          components={{
            pre: ({ children }) => <pre className="blog-code">{children}</pre>,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="relative">
                  <pre className={`${className} p-2 rounded`}>
                    <code {...props}>{String(children).replace(/\n$/, '')}</code>
                  </pre>
                  <button
                    onClick={() => {
                      const codeContent = children?.toString() || ''
                      const codeBlockMatch = codeContent.match(/^```[\w]*\n?([\s\S]*?)\n?```$/m)
                      const codeBlock = codeBlockMatch ? codeBlockMatch[1].trim() : codeContent.trim()
                      copyToClipboard(codeBlock)
                    }}
                    className="absolute top-2 right-2 p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <FiCopy size={16} />
                  </button>
                  {copied && (
                    <span className="absolute top-2 right-10 text-xs bg-green-500 text-white px-2 py-1 rounded">
                      Copied!
                    </span>
                  )}
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

const ChatInput = ({ formAction, isPending, input, setInput }: {
  formAction: (formData: FormData) => void,
  isPending: boolean,
  input: string,
  setInput: (value: string) => void
}) => (
  <form action={formAction} className="flex space-x-2">
    <textarea
      name="message"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      disabled={isPending}
    />
    <button
      type="submit"
      disabled={isPending}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Thinking...' : 'Send'}
    </button>
  </form>
)

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const userMessage = formData.get('message') as string
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')

    try {
      const response = await generateCode(userMessage)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error generating response:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }, null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="w-full relative h-dvh overflow-hidden mx-auto bg-white shadow-lg rounded-lg flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Alx</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <ChatInput
          formAction={formAction}
          isPending={isPending}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  )
}