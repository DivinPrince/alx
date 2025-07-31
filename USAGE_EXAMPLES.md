# Usage Examples & Integration Guide

## Overview

This document provides comprehensive usage examples, integration patterns, and practical implementation guides for the Alx competitive programming solution generator application.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage Examples](#basic-usage-examples)
- [Advanced Integration Patterns](#advanced-integration-patterns)
- [API Usage Examples](#api-usage-examples)
- [Component Integration](#component-integration)
- [Customization Examples](#customization-examples)
- [Testing Examples](#testing-examples)
- [Deployment Guide](#deployment-guide)

## Getting Started

### Prerequisites

```bash
# Node.js 18+ required
node --version

# Package manager (npm, yarn, pnpm, or bun)
npm --version
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd alx-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Google AI API key to .env.local
```

### Environment Setup

```bash
# .env.local
GOOGLE_AI_API_KEY=your_api_key_here
```

### Development Server

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## Basic Usage Examples

### 1. Simple Problem Solving

**User Input:**
```
Solve the two-sum problem: Given an array of integers and a target sum, find two numbers that add up to the target.
```

**Expected AI Response:**
```markdown
ANALYSIS:
- Problem constraints: Array of integers, target sum
- Key algorithmic challenges: Finding pair efficiently
- Chosen approach: Hash map for O(n) solution

SOLUTION:
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test cases
print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]
print(two_sum([3, 2, 4], 6))       # Output: [1, 2]
```

VERIFICATION:
- Time complexity: O(n)
- Space complexity: O(n)
- Handles duplicates and edge cases
```

### 2. Algorithm Implementation

**User Input:**
```
Implement a binary search algorithm with detailed explanation
```

**Expected Features:**
- Complete implementation
- Time/space complexity analysis
- Test cases with edge conditions
- Step-by-step explanation

### 3. Data Structure Problems

**User Input:**
```
Create a binary search tree with insert, delete, and search operations. Include in-order traversal.
```

**Response Includes:**
- Complete BST class implementation
- All requested operations
- Helper methods
- Comprehensive test cases

## Advanced Integration Patterns

### 1. Custom Component Integration

```tsx
// CustomChatWrapper.tsx
import { useState } from 'react'
import ChatComponent from './app/page'

interface CustomChatWrapperProps {
  theme?: 'light' | 'dark'
  onMessageSent?: (message: string) => void
  onResponseReceived?: (response: string) => void
}

export default function CustomChatWrapper({ 
  theme = 'light',
  onMessageSent,
  onResponseReceived 
}: CustomChatWrapperProps) {
  return (
    <div className={`chat-wrapper ${theme}`}>
      <div className="chat-header">
        <h1>Custom Programming Assistant</h1>
      </div>
      <ChatComponent />
    </div>
  )
}
```

### 2. Server Action Extension

```typescript
// extended-actions.ts
"use server"
import { generateCode } from './app/actions'

export async function generateCodeWithContext(
  prompt: string,
  context?: {
    language?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    constraints?: string
  }
) {
  let enhancedPrompt = prompt
  
  if (context) {
    enhancedPrompt = `
    ${prompt}
    
    Additional Context:
    - Preferred language: ${context.language || 'any'}
    - Difficulty level: ${context.difficulty || 'medium'}
    - Constraints: ${context.constraints || 'standard competitive programming'}
    `
  }
  
  return await generateCode(enhancedPrompt)
}

// Usage example
const solution = await generateCodeWithContext(
  "Solve the knapsack problem",
  {
    language: "Python",
    difficulty: "hard",
    constraints: "Time limit: 1 second, Memory limit: 256MB"
  }
)
```

### 3. Message Processing Pipeline

```typescript
// message-processor.ts
interface MessageProcessor {
  preProcess?: (message: string) => string
  postProcess?: (response: string) => string
  validate?: (message: string) => boolean
}

export function createMessageProcessor(options: MessageProcessor) {
  return {
    async processMessage(message: string) {
      // Pre-processing
      let processedMessage = message
      if (options.preProcess) {
        processedMessage = options.preProcess(message)
      }
      
      // Validation
      if (options.validate && !options.validate(processedMessage)) {
        throw new Error('Message validation failed')
      }
      
      // Generate response
      const response = await generateCode(processedMessage)
      
      // Post-processing
      if (options.postProcess) {
        return options.postProcess(response)
      }
      
      return response
    }
  }
}

// Usage
const processor = createMessageProcessor({
  preProcess: (msg) => `Please solve this step by step: ${msg}`,
  postProcess: (response) => response + '\n\n*Generated by Alx AI*',
  validate: (msg) => msg.length > 10
})
```

## API Usage Examples

### 1. Direct Server Action Usage

```typescript
// In a React component
import { generateCode } from './app/actions'

function ProblemSolver() {
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  
  const solveProblem = async (problemDescription: string) => {
    setLoading(true)
    try {
      const result = await generateCode(problemDescription)
      setSolution(result)
    } catch (error) {
      console.error('Failed to generate solution:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <button onClick={() => solveProblem("Implement quicksort")}>
        Solve Quicksort
      </button>
      {loading && <p>Generating solution...</p>}
      {solution && <pre>{solution}</pre>}
    </div>
  )
}
```

### 2. Batch Problem Solving

```typescript
// batch-solver.ts
import { generateCode } from './app/actions'

interface Problem {
  id: string
  description: string
  difficulty: string
}

export async function solveBatchProblems(problems: Problem[]) {
  const solutions = await Promise.allSettled(
    problems.map(async (problem) => ({
      id: problem.id,
      solution: await generateCode(problem.description),
      difficulty: problem.difficulty
    }))
  )
  
  return solutions.map((result, index) => ({
    problem: problems[index],
    success: result.status === 'fulfilled',
    solution: result.status === 'fulfilled' ? result.value.solution : null,
    error: result.status === 'rejected' ? result.reason : null
  }))
}

// Usage
const problems = [
  { id: '1', description: 'Two Sum', difficulty: 'easy' },
  { id: '2', description: 'Binary Search', difficulty: 'easy' },
  { id: '3', description: 'Merge Sort', difficulty: 'medium' }
]

const results = await solveBatchProblems(problems)
```

### 3. Streaming Responses (Future Enhancement)

```typescript
// streaming-solution.ts (conceptual implementation)
export async function* generateCodeStream(prompt: string) {
  // This would require server-side streaming implementation
  const stream = await generateTextStream({
    system: systemPrompt,
    model: google("models/gemini-1.5-flash"),
    prompt: prompt,
  })
  
  for await (const chunk of stream) {
    yield chunk.text
  }
}

// Usage in component
function StreamingSolver() {
  const [chunks, setChunks] = useState<string[]>([])
  
  const solveWithStreaming = async (problem: string) => {
    setChunks([])
    for await (const chunk of generateCodeStream(problem)) {
      setChunks(prev => [...prev, chunk])
    }
  }
  
  return (
    <div>
      <pre>{chunks.join('')}</pre>
    </div>
  )
}
```

## Component Integration

### 1. Custom Message Bubble

```tsx
// CustomMessageBubble.tsx
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

interface CustomMessageBubbleProps {
  message: Message
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void
  showFeedback?: boolean
}

export function CustomMessageBubble({ 
  message, 
  onFeedback,
  showFeedback = false 
}: CustomMessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  
  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type)
    onFeedback?.(message.id, type)
  }
  
  return (
    <div className={`message-bubble ${message.role}`}>
      <ReactMarkdown>{message.content}</ReactMarkdown>
      
      {message.role === 'assistant' && (
        <div className="message-actions">
          {showFeedback && (
            <div className="feedback-buttons">
              <button 
                onClick={() => handleFeedback('up')}
                className={feedback === 'up' ? 'active' : ''}
              >
                <FiThumbsUp />
              </button>
              <button 
                onClick={() => handleFeedback('down')}
                className={feedback === 'down' ? 'active' : ''}
              >
                <FiThumbsDown />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 2. Enhanced Chat Input

```tsx
// EnhancedChatInput.tsx
import { useState } from 'react'
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi'

interface EnhancedChatInputProps {
  onSubmit: (message: string, attachments?: File[]) => void
  placeholder?: string
  maxLength?: number
  supportAttachments?: boolean
  supportVoice?: boolean
}

export function EnhancedChatInput({
  onSubmit,
  placeholder = "Describe your programming problem...",
  maxLength = 2000,
  supportAttachments = false,
  supportVoice = false
}: EnhancedChatInputProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input, attachments)
      setInput('')
      setAttachments([])
    }
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="enhanced-chat-input">
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
        />
        
        <div className="input-actions">
          {supportAttachments && (
            <label className="attachment-button">
              <FiPaperclip />
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          )}
          
          {supportVoice && (
            <button type="button" className="voice-button">
              <FiMic />
            </button>
          )}
          
          <button type="submit" disabled={!input.trim()}>
            <FiSend />
          </button>
        </div>
      </div>
      
      {attachments.length > 0 && (
        <div className="attachments">
          {attachments.map((file, index) => (
            <span key={index} className="attachment">
              {file.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="character-count">
        {input.length}/{maxLength}
      </div>
    </form>
  )
}
```

## Customization Examples

### 1. Theme Customization

```typescript
// theme.ts
export const themes = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#10b981'
  },
  dark: {
    background: '#1f2937',
    foreground: '#f9fafb',
    primary: '#60a5fa',
    secondary: '#9ca3af',
    accent: '#34d399'
  },
  competitive: {
    background: '#0f172a',
    foreground: '#e2e8f0',
    primary: '#f59e0b',
    secondary: '#64748b',
    accent: '#06b6d4'
  }
}

// ThemeProvider.tsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<{
  theme: keyof typeof themes
  setTheme: (theme: keyof typeof themes) => void
}>({
  theme: 'light',
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<keyof typeof themes>('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div style={themes[theme]}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 2. Language-Specific Configurations

```typescript
// language-config.ts
export const languageConfigs = {
  python: {
    defaultTemplate: `def solution():
    # Your code here
    pass

# Test cases
if __name__ == "__main__":
    # Add test cases
    pass`,
    syntaxHighlight: 'python',
    fileExtension: '.py'
  },
  javascript: {
    defaultTemplate: `function solution() {
    // Your code here
}

// Test cases
console.log(solution());`,
    syntaxHighlight: 'javascript',
    fileExtension: '.js'
  },
  cpp: {
    defaultTemplate: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    syntaxHighlight: 'cpp',
    fileExtension: '.cpp'
  }
}

// Usage in component
function LanguageSelector({ onLanguageChange }: { onLanguageChange: (lang: string) => void }) {
  return (
    <select onChange={(e) => onLanguageChange(e.target.value)}>
      {Object.keys(languageConfigs).map(lang => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
```

### 3. Custom Prompt Templates

```typescript
// prompt-templates.ts
export const promptTemplates = {
  algorithm: (problem: string) => `
    Implement an algorithm to solve: ${problem}
    
    Requirements:
    - Provide time and space complexity analysis
    - Include edge case handling
    - Add comprehensive test cases
    - Explain the approach step by step
  `,
  
  dataStructure: (structure: string, operations: string[]) => `
    Implement a ${structure} data structure with the following operations:
    ${operations.map(op => `- ${op}`).join('\n')}
    
    Requirements:
    - Include all basic operations
    - Handle edge cases
    - Provide usage examples
    - Analyze time complexity for each operation
  `,
  
  optimization: (code: string, issue: string) => `
    Optimize the following code for ${issue}:
    
    \`\`\`
    ${code}
    \`\`\`
    
    Requirements:
    - Identify performance bottlenecks
    - Provide optimized solution
    - Compare time/space complexity
    - Maintain code readability
  `
}

// Usage
const algorithmPrompt = promptTemplates.algorithm("finding the longest palindromic substring")
const response = await generateCode(algorithmPrompt)
```

## Testing Examples

### 1. Component Testing

```typescript
// __tests__/MessageBubble.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MessageBubble } from '../app/page'

describe('MessageBubble', () => {
  const mockMessage = {
    role: 'assistant' as const,
    content: '```python\nprint("Hello, World!")\n```'
  }
  
  test('renders message content', () => {
    render(<MessageBubble message={mockMessage} />)
    expect(screen.getByText('print("Hello, World!")')).toBeInTheDocument()
  })
  
  test('copy functionality works', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve())
      }
    })
    
    render(<MessageBubble message={mockMessage} />)
    
    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('print("Hello, World!")')
  })
})
```

### 2. Server Action Testing

```typescript
// __tests__/actions.test.ts
import { generateCode } from '../app/actions'

// Mock the AI SDK
jest.mock('ai', () => ({
  generateText: jest.fn()
}))

jest.mock('@ai-sdk/google', () => ({
  google: jest.fn()
}))

describe('generateCode', () => {
  test('generates code solution', async () => {
    const mockResponse = 'def two_sum(nums, target):\n    # Solution here'
    
    require('ai').generateText.mockResolvedValue({ text: mockResponse })
    
    const result = await generateCode('Solve two sum problem')
    
    expect(result).toBe(mockResponse)
  })
  
  test('handles errors gracefully', async () => {
    require('ai').generateText.mockRejectedValue(new Error('API Error'))
    
    await expect(generateCode('Invalid prompt')).rejects.toThrow('API Error')
  })
})
```

### 3. Integration Testing

```typescript
// __tests__/integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatComponent from '../app/page'

// Mock server actions
jest.mock('../app/actions', () => ({
  generateCode: jest.fn()
}))

describe('Chat Integration', () => {
  test('complete chat flow', async () => {
    const mockGenerateCode = require('../app/actions').generateCode
    mockGenerateCode.mockResolvedValue('Solution: def solve(): pass')
    
    render(<ChatComponent />)
    
    // Type message
    const input = screen.getByPlaceholderText('Type your message...')
    fireEvent.change(input, { target: { value: 'Solve binary search' } })
    
    // Submit form
    const submitButton = screen.getByText('Send')
    fireEvent.click(submitButton)
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Solution: def solve(): pass')).toBeInTheDocument()
    })
    
    expect(mockGenerateCode).toHaveBeenCalledWith('Solve binary search')
  })
})
```

## Deployment Guide

### 1. Environment Configuration

```bash
# Production environment variables
GOOGLE_AI_API_KEY=your_production_api_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  alx-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/actions.ts": {
      "maxDuration": 30
    }
  }
}
```

### 4. Performance Monitoring

```typescript
// monitoring.ts
export function trackPerformance(action: string, duration: number) {
  // Integration with monitoring service
  console.log(`Action: ${action}, Duration: ${duration}ms`)
  
  // Example: Send to analytics
  if (typeof window !== 'undefined') {
    (window as any).gtag?.('event', 'timing_complete', {
      name: action,
      value: duration
    })
  }
}

// Usage in components
const startTime = Date.now()
const response = await generateCode(prompt)
trackPerformance('generateCode', Date.now() - startTime)
```

This comprehensive documentation provides everything needed to understand, use, and extend the Alx competitive programming solution generator application. Each section includes practical examples and real-world usage patterns.