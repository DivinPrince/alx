# Functions & Utilities Documentation

## Overview

This document provides comprehensive documentation for all functions, utilities, and helper methods in the Alx competitive programming solution generator application.

## Table of Contents

- [Server Actions](#server-actions)
- [Component Functions](#component-functions)
- [Utility Functions](#utility-functions)
- [Event Handlers](#event-handlers)
- [Configuration Functions](#configuration-functions)
- [Type Definitions](#type-definitions)

## Server Actions

### `generateCode(prompt: string): Promise<string>`

**File**: `app/actions.ts` (lines 71-79)  
**Type**: Server Action  
**Directive**: `"use server"`

#### Description

Generates competitive programming solutions using Google's Gemini AI model. This function processes user prompts and returns comprehensive programming solutions with analysis, verification, and test cases.

#### Parameters

```typescript
prompt: string  // User's problem description or programming request
```

#### Returns

```typescript
Promise<string>  // AI-generated solution with complete analysis
```

#### Implementation

```typescript
export const generateCode = async (prompt: string) => {
    const { text } = await generateText({
        system: systemPrompt,
        model: google("models/gemini-1.5-flash"),
        prompt: prompt,
    })

    return text
}
```

#### System Prompt Features

The function uses a comprehensive system prompt that includes:

- **Checker Analysis**: Understanding of testlib.h framework
- **Solution Protocol**: Structured approach to problem-solving
- **Code Generation Rules**: Best practices for competitive programming
- **Output Verification**: Ensuring correct formatting and precision
- **Testing Methodology**: Comprehensive test case coverage
- **Error Prevention**: Defensive programming practices

#### Usage Examples

```typescript
// Basic usage
const solution = await generateCode("Solve the two-sum problem")

// Complex problem
const solution = await generateCode(`
Given an array of integers and a target sum, find all unique triplets 
that sum to the target. The solution should have O(n²) time complexity.
`)

// With constraints
const solution = await generateCode(`
Implement a binary search tree with the following operations:
- Insert
- Delete  
- Search
- In-order traversal
Memory limit: 256MB, Time limit: 2 seconds
`)
```

#### Response Format

The AI returns structured responses in this format:

```
ANALYSIS:
- Problem constraints identified
- Key algorithmic challenges  
- Chosen approach justification

SOLUTION:
[Complete, compilable code]

VERIFICATION:
- Time complexity analysis
- Memory usage analysis
- Test case coverage
- Edge case handling explanation
```

#### Error Handling

```typescript
try {
    const response = await generateCode(userMessage)
    // Handle successful response
} catch (error) {
    console.error('Error generating response:', error)
    // Fallback error message
}
```

#### Dependencies

- `ai` package: `generateText` function
- `@ai-sdk/google`: Google AI integration
- Google Gemini 1.5 Flash model

---

## Component Functions

### `copyToClipboard(text: string): void`

**File**: `app/page.tsx` (lines 17-24)  
**Component**: MessageBubble  
**Type**: Utility Function

#### Description

Copies text content to the user's clipboard with visual feedback and error handling.

#### Parameters

```typescript
text: string  // Text content to copy to clipboard
```

#### Returns

```typescript
void
```

#### Implementation

```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }).catch(err => {
    console.error('Failed to copy text: ', err)
  })
}
```

#### Features

- **Async Operation**: Uses Clipboard API for modern browsers
- **Visual Feedback**: Sets `copied` state for UI indication
- **Auto-reset**: Resets feedback after 2 seconds
- **Error Handling**: Logs errors for debugging

#### Usage Examples

```typescript
// Copy code block
const codeContent = "def hello():\n    print('Hello, World!')"
copyToClipboard(codeContent)

// Copy with code block extraction
const codeBlockMatch = content.match(/^```[\w]*\n?([\s\S]*?)\n?```$/m)
const codeBlock = codeBlockMatch ? codeBlockMatch[1].trim() : content.trim()
copyToClipboard(codeBlock)
```

#### Browser Compatibility

- **Modern Browsers**: Uses `navigator.clipboard.writeText()`
- **Fallback**: Error logging for unsupported browsers
- **Security**: Requires HTTPS context for clipboard access

---

### Form Action Handler

**File**: `app/page.tsx` (lines 109-121)  
**Component**: ChatComponent  
**Type**: Server Action Handler

#### Description

Handles form submission for chat messages, manages state updates, and coordinates with AI services.

#### Parameters

```typescript
prevState: any        // Previous action state (unused)
formData: FormData   // Form data containing user message
```

#### Returns

```typescript
Promise<void>
```

#### Implementation

```typescript
const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
  const userMessage = formData.get('message') as string
  setMessages(prev => [...prev, { role: 'user', content: userMessage }])
  setInput('')

  try {
    const response = await generateCode(userMessage)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  } catch (error) {
    console.error('Error generating response:', error)
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error. Please try again.' 
    }])
  }
}, null)
```

#### State Management

- **Optimistic Updates**: Immediately adds user message
- **Input Reset**: Clears input field after submission
- **Error Recovery**: Provides fallback error message
- **Loading States**: `isPending` indicates processing status

#### Usage Pattern

```typescript
// In ChatComponent
<form action={formAction}>
  <textarea name="message" />
  <button type="submit" disabled={isPending}>
    {isPending ? 'Thinking...' : 'Send'}
  </button>
</form>
```

---

## Utility Functions

### Auto-scroll Effect

**File**: `app/page.tsx` (lines 123-127)  
**Component**: ChatComponent  
**Type**: Side Effect

#### Description

Automatically scrolls the chat interface to show the latest messages when new messages are added.

#### Implementation

```typescript
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
}, [messages])
```

#### Features

- **Smooth Scrolling**: Uses `behavior: 'smooth'` for better UX
- **Ref-based**: Uses `messagesEndRef` for precise targeting
- **Dependency Tracking**: Triggers on `messages` array changes
- **Null Safety**: Checks ref existence before scrolling

#### Usage Pattern

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null)

// In JSX
<div ref={messagesEndRef} />
```

---

### Code Block Extraction

**File**: `app/page.tsx` (lines 50-52)  
**Component**: MessageBubble  
**Type**: Text Processing

#### Description

Extracts clean code content from markdown code blocks for clipboard operations.

#### Implementation

```typescript
const codeContent = children?.toString() || ''
const codeBlockMatch = codeContent.match(/^```[\w]*\n?([\s\S]*?)\n?```$/m)
const codeBlock = codeBlockMatch ? codeBlockMatch[1].trim() : codeContent.trim()
```

#### Features

- **Regex Matching**: Identifies markdown code blocks
- **Language Detection**: Handles optional language specifiers
- **Content Extraction**: Removes markdown syntax
- **Fallback**: Returns original content if no match

#### Regex Breakdown

```typescript
/^```[\w]*\n?([\s\S]*?)\n?```$/m
// ^```        - Start with triple backticks
// [\w]*       - Optional language identifier
// \n?         - Optional newline
// ([\s\S]*?)  - Capture group for content (non-greedy)
// \n?         - Optional trailing newline
// ```$        - End with triple backticks
// m flag      - Multiline mode
```

---

## Event Handlers

### Input Change Handler

**File**: `app/page.tsx` (line 89)  
**Component**: ChatInput  
**Type**: Event Handler

#### Description

Handles textarea input changes and updates component state.

#### Implementation

```typescript
onChange={(e) => setInput(e.target.value)}
```

#### Parameters

```typescript
e: React.ChangeEvent<HTMLTextAreaElement>
```

#### Features

- **Real-time Updates**: Updates state on every keystroke
- **Type Safety**: Properly typed event parameter
- **Controlled Component**: Maintains single source of truth

---

### Copy Button Click Handler

**File**: `app/page.tsx` (lines 48-53)  
**Component**: MessageBubble  
**Type**: Event Handler

#### Description

Handles copy button clicks and extracts appropriate code content.

#### Implementation

```typescript
onClick={() => {
  const codeContent = children?.toString() || ''
  const codeBlockMatch = codeContent.match(/^```[\w]*\n?([\s\S]*?)\n?```$/m)
  const codeBlock = codeBlockMatch ? codeBlockMatch[1].trim() : codeContent.trim()
  copyToClipboard(codeBlock)
}}
```

#### Features

- **Content Processing**: Extracts clean code from markdown
- **Fallback Handling**: Uses original content if extraction fails
- **Integration**: Calls `copyToClipboard` utility function

---

## Configuration Functions

### Font Configuration

**File**: `app/layout.tsx` (lines 5-14)  
**Type**: Font Configuration

#### Description

Configures custom font loading for the application using Next.js `localFont`.

#### Implementation

```typescript
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})
```

#### Features

- **Variable Fonts**: Supports full weight range (100-900)
- **CSS Variables**: Creates CSS custom properties
- **Local Loading**: Loads fonts from local files
- **Performance**: Optimized font loading with Next.js

#### Usage in CSS

```css
.font-sans {
  font-family: var(--font-geist-sans);
}

.font-mono {
  font-family: var(--font-geist-mono);
}
```

---

### Tailwind Configuration

**File**: `tailwind.config.ts`  
**Type**: Build Configuration

#### Description

Configures Tailwind CSS for the application with custom theme extensions.

#### Implementation

```typescript
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
```

#### Features

- **Content Scanning**: Includes all relevant file patterns
- **Theme Extension**: Adds custom CSS variable colors
- **Zero Plugins**: Uses core Tailwind functionality only

---

## Type Definitions

### Message Interface

**File**: `app/page.tsx` (lines 9-12)  
**Type**: Interface Definition

#### Description

Defines the structure for chat messages in the application.

#### Definition

```typescript
interface Message {
  role: 'user' | 'assistant'
  content: string
}
```

#### Properties

- `role`: Discriminates between user and AI messages
- `content`: Holds the message text (supports markdown)

#### Usage Examples

```typescript
// User message
const userMsg: Message = {
  role: 'user',
  content: 'Solve the binary search problem'
}

// Assistant message
const assistantMsg: Message = {
  role: 'assistant',
  content: '```python\ndef binary_search(arr, target):\n    # Implementation\n```'
}
```

---

### Component Props Types

#### MessageBubbleProps

```typescript
interface MessageBubbleProps {
  message: Message
}
```

#### ChatInputProps

```typescript
interface ChatInputProps {
  formAction: (formData: FormData) => void
  isPending: boolean
  input: string
  setInput: (value: string) => void
}
```

#### RootLayoutProps

```typescript
interface RootLayoutProps {
  children: React.ReactNode
}
```

---

## Performance Optimizations

### Memoization Opportunities

```typescript
// Potential optimizations (not currently implemented)
const MemoizedMessageBubble = React.memo(MessageBubble)
const MemoizedChatInput = React.memo(ChatInput)
```

### Debouncing

```typescript
// Copy feedback debouncing
setTimeout(() => setCopied(false), 2000)
```

### Efficient Updates

```typescript
// Immutable state updates
setMessages(prev => [...prev, newMessage])
```

## Error Handling Patterns

### Async Function Error Handling

```typescript
try {
  const response = await generateCode(userMessage)
  // Success path
} catch (error) {
  console.error('Error generating response:', error)
  // Error recovery
}
```

### Clipboard API Error Handling

```typescript
navigator.clipboard.writeText(text)
  .then(() => {
    // Success feedback
  })
  .catch(err => {
    console.error('Failed to copy text: ', err)
    // Could implement fallback copy method
  })
```

### Form Validation

```typescript
const userMessage = formData.get('message') as string
if (!userMessage.trim()) {
  // Handle empty message
  return
}
```