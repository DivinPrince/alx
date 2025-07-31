# Component Documentation

## Overview

This document provides detailed documentation for all React components in the Alx competitive programming solution generator application.

## Table of Contents

- [ChatComponent](#chatcomponent)
- [MessageBubble](#messagebubble)
- [ChatInput](#chatinput)
- [RootLayout](#rootlayout)
- [Component Relationships](#component-relationships)
- [Styling Guide](#styling-guide)
- [State Management](#state-management)

## ChatComponent

**File**: `app/page.tsx` (lines 104-150)  
**Type**: Default Export, Client Component

### Description

The main chat interface component that orchestrates the entire user experience. It manages conversation state, handles user input, and coordinates with AI services to generate programming solutions.

### Props

None - This is the root page component.

### State

```typescript
interface ChatComponentState {
  messages: Message[]        // Array of conversation messages
  input: string             // Current input field value
  isPending: boolean        // Loading state from useActionState
}
```

### Hooks Used

- `useState<Message[]>`: Manages conversation history
- `useState<string>`: Manages input field state
- `useActionState`: Handles form submission and loading states
- `useRef<HTMLDivElement>`: Reference for auto-scrolling
- `useEffect`: Auto-scroll to latest messages

### Features

- **Real-time Chat Interface**: Displays conversation between user and AI
- **Auto-scrolling**: Automatically scrolls to show latest messages
- **Loading States**: Shows "Thinking..." while AI processes requests
- **Error Handling**: Gracefully handles AI service errors
- **Responsive Design**: Adapts to different screen sizes

### Usage Example

```jsx
// app/page.tsx - Default export
export default function Page() {
  return <ChatComponent />
}

// Or in other components
import ChatComponent from './page'

function App() {
  return (
    <div className="container">
      <ChatComponent />
    </div>
  )
}
```

### Implementation Details

```typescript
const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
  const userMessage = formData.get('message') as string
  
  // Add user message immediately
  setMessages(prev => [...prev, { role: 'user', content: userMessage }])
  setInput('')

  try {
    // Call AI service
    const response = await generateCode(userMessage)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  } catch (error) {
    // Handle errors gracefully
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error. Please try again.' 
    }])
  }
}, null)
```

### Styling

- **Container**: Full viewport height with flex layout
- **Header**: Fixed header with application title
- **Messages Area**: Scrollable flex-1 container
- **Input Area**: Fixed bottom input section

---

## MessageBubble

**File**: `app/page.tsx` (lines 14-77)  
**Type**: Functional Component

### Description

Renders individual chat messages with advanced markdown support, syntax highlighting, and interactive code copying functionality.

### Props

```typescript
interface MessageBubbleProps {
  message: Message
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}
```

### State

```typescript
interface MessageBubbleState {
  copied: boolean  // Tracks copy operation feedback
}
```

### Features

- **Markdown Rendering**: Full markdown support via ReactMarkdown
- **Code Highlighting**: Syntax highlighting for code blocks
- **Copy Functionality**: One-click code copying with visual feedback
- **Role-based Styling**: Different styles for user vs assistant messages
- **Responsive Layout**: Adapts to different screen sizes

### Usage Example

```jsx
import { MessageBubble } from './page'

// Basic usage
const userMessage = {
  role: 'user',
  content: 'Solve the two-sum problem'
}

const assistantMessage = {
  role: 'assistant',
  content: `Here's the solution:

\`\`\`python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\`

**Time Complexity**: O(n)  
**Space Complexity**: O(n)`
}

// Render messages
<MessageBubble message={userMessage} />
<MessageBubble message={assistantMessage} />
```

### Code Copy Functionality

```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }).catch(err => {
    console.error('Failed to copy text: ', err)
  })
}
```

### Markdown Configuration

```jsx
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
          {/* Copy button implementation */}
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
```

### Styling Classes

- **User Messages**: `bg-blue-500 text-white` (right-aligned)
- **Assistant Messages**: `bg-gray-100 text-gray-800` (left-aligned)
- **Code Blocks**: Syntax highlighting with copy button overlay
- **Copy Button**: Hover effects and success feedback

---

## ChatInput

**File**: `app/page.tsx` (lines 79-102)  
**Type**: Functional Component

### Description

Input form component that handles user message submission with loading states and form validation.

### Props

```typescript
interface ChatInputProps {
  formAction: (formData: FormData) => void  // Server action for form submission
  isPending: boolean                        // Loading state indicator
  input: string                            // Current input value
  setInput: (value: string) => void        // Input state setter
}
```

### Features

- **Multi-line Input**: Textarea for longer messages
- **Loading States**: Disabled during AI processing
- **Form Integration**: Works with Next.js server actions
- **Keyboard Accessibility**: Proper form submission handling
- **Responsive Design**: Adapts to container width

### Usage Example

```jsx
import { ChatInput } from './page'

function ChatInterface() {
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    // Process form data
    setIsPending(false)
  }

  return (
    <ChatInput
      formAction={handleSubmit}
      isPending={isPending}
      input={input}
      setInput={setInput}
    />
  )
}
```

### Implementation Details

```jsx
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
```

### Accessibility Features

- **Focus Management**: Proper focus rings and states
- **Disabled States**: Clear visual indication when processing
- **Keyboard Navigation**: Standard form submission (Enter key)
- **Screen Reader Support**: Semantic HTML elements

---

## RootLayout

**File**: `app/layout.tsx` (lines 21-35)  
**Type**: Layout Component

### Description

Root layout component that provides the foundational HTML structure, font configuration, and global metadata for the entire application.

### Props

```typescript
interface RootLayoutProps {
  children: React.ReactNode
}
```

### Features

- **Font Loading**: Custom Geist font family integration
- **CSS Variables**: Font variable setup for global use
- **SEO Metadata**: Title and description configuration
- **Global Styles**: CSS imports and base styling

### Usage Example

```jsx
// Automatically used by Next.js App Router
// No manual implementation needed

// The layout wraps all pages:
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### Font Configuration

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

### Metadata Export

```typescript
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}
```

---

## Component Relationships

```
RootLayout
└── ChatComponent (page.tsx)
    ├── MessageBubble (for each message)
    │   └── ReactMarkdown
    │       └── Code blocks with copy functionality
    └── ChatInput
        └── Form with textarea and submit button
```

### Data Flow

1. **User Input**: ChatInput → ChatComponent
2. **AI Processing**: ChatComponent → generateCode action
3. **Response Display**: ChatComponent → MessageBubble
4. **Code Interaction**: MessageBubble → Clipboard API

---

## Styling Guide

### Design System

- **Primary Color**: Blue (`bg-blue-500`, `text-blue-500`)
- **Neutral Colors**: Gray scale for backgrounds and text
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Spacing**: Tailwind's spacing scale (p-4, m-4, etc.)
- **Borders**: Rounded corners (`rounded-lg`) and subtle borders

### Responsive Breakpoints

- **Mobile**: Default styles (single column)
- **Tablet**: Maintains single column with adjusted spacing
- **Desktop**: Full width with optimal spacing

### Animation Classes

- **Transitions**: `transition-colors` for smooth hover effects
- **Focus States**: `focus:ring-2` for accessibility
- **Hover Effects**: `hover:bg-blue-600` for interactive elements

---

## State Management

### Local State Patterns

```typescript
// Message management
const [messages, setMessages] = useState<Message[]>([])

// Input handling
const [input, setInput] = useState('')

// Loading states
const [isPending, setIsPending] = useState(false)

// UI feedback
const [copied, setCopied] = useState(false)
```

### Server State Integration

```typescript
// Using useActionState for server actions
const [state, formAction, isPending] = useActionState(
  async (prevState: any, formData: FormData) => {
    // Server action implementation
  },
  null
)
```

### Effect Management

```typescript
// Auto-scroll to latest messages
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
}, [messages])
```

## Performance Considerations

- **Message Rendering**: Uses React keys for efficient list updates
- **Code Highlighting**: Lazy loading for syntax highlighting
- **Scroll Optimization**: Smooth scrolling with proper refs
- **Copy Operations**: Debounced feedback states
- **Server Actions**: Optimistic UI updates where appropriate