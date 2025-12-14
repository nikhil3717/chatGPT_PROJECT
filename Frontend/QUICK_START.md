# Redux Chat Setup - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
# or
bun install
```

The following packages have been added to `package.json`:
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React integration

### Step 2: Files Already Created
No additional setup needed! These files have been created:

```
src/
├── redux/
│   ├── store.js              # ✅ Created
│   ├── slices/
│   │   └── chatSlice.js      # ✅ Created
│   └── selectors.js          # ✅ Created
├── hooks/
│   └── useChat.js            # ✅ Created
└── styles/chatLayout.css     # ✅ Updated with modal styles
```

### Step 3: Start Using in Your Components

**Option A: Using the Custom Hook (Recommended)**
```javascript
import { useChat } from '../hooks/useChat';

const MyComponent = () => {
  const { currentChat, messages, createNewChat, sendMessage } = useChat();
  
  // Use in component
};
```

**Option B: Using Redux Directly**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentChat, selectMessages } from '../redux/selectors';
import { createChat, addMessage } from '../redux/slices/chatSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const messages = useSelector(selectMessages);
  
  // Use in component
};
```

---

## 📋 Redux State Structure

```javascript
{
  chat: {
    currentChat: null | { id, title, createdAt },
    chats: [ { id, title, createdAt }, ... ],
    messages: [ { id, text, role, timestamp }, ... ],
    isLoading: false,
    error: null
  }
}
```

---

## 🎯 Common Operations

### Create New Chat
```javascript
const { createNewChat } = useChat();

// Simple
createNewChat();

// With title
createNewChat('Web Development Help');
```

### Send Message
```javascript
const { sendMessage } = useChat();

sendMessage('Hello!', 'user');
sendMessage('Hi there!', 'assistant');
```

### Select Chat
```javascript
const { selectChatById } = useChat();

selectChatById('chat-123');
```

### Delete Chat
```javascript
const { removeChatById } = useChat();

removeChatById('chat-123');
```

### Set Loading State
```javascript
const { setLoadingState } = useChat();

setLoadingState(true);  // Show loading
setLoadingState(false); // Hide loading
```

### Get All Data
```javascript
const {
  currentChat,
  chats,
  messages,
  isLoading,
  error
} = useChat();
```

---

## 💡 Example: Complete Chat Component

```javascript
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

const ChatApp = () => {
  const {
    currentChat,
    messages,
    isLoading,
    sendMessage,
    createNewChat,
    selectChatById,
    chats
  } = useChat();
  
  const [input, setInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [chatTitle, setChatTitle] = useState('');

  // Handle new chat creation
  const handleCreateChat = () => {
    const title = chatTitle.trim() || 'New Chat';
    createNewChat(title);
    setShowPrompt(false);
    setChatTitle('');
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    sendMessage(input, 'user');
    const userMessage = input;
    setInput('');

    // Simulate AI response (replace with API call)
    setTimeout(() => {
      sendMessage(`Response to: ${userMessage}`, 'assistant');
    }, 1000);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <button onClick={() => setShowPrompt(true)} className="new-btn">
          + New Chat
        </button>
        <div className="chats">
          {chats.map(chat => (
            <button
              key={chat.id}
              className={`chat-btn ${
                currentChat?.id === chat.id ? 'active' : ''
              }`}
              onClick={() => selectChatById(chat.id)}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-main">
        <h1>{currentChat?.title || 'Select a chat'}</h1>

        {/* Messages */}
        <div className="messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="loading">Thinking...</div>}
        </div>

        {/* Input */}
        <div className="input-area">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
      </main>

      {/* Modal */}
      {showPrompt && (
        <div className="modal-overlay" onClick={() => setShowPrompt(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Chat</h2>
            <input
              type="text"
              value={chatTitle}
              onChange={e => setChatTitle(e.target.value)}
              placeholder="Chat title (optional)"
              onKeyPress={e => e.key === 'Enter' && handleCreateChat()}
              autoFocus
            />
            <div className="buttons">
              <button onClick={() => setShowPrompt(false)}>Cancel</button>
              <button onClick={handleCreateChat}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
```

---

## 🔧 Available Hook Methods

### State Accessors
```javascript
const {
  currentChat,          // Current active chat
  messages,            // Messages in current chat
  chats,               // All chats array
  isLoading,           // Loading state
  error                // Error message
} = useChat();
```

### Action Methods
```javascript
const {
  createNewChat(title),           // Create new chat
  sendMessage(text, role),        // Add message
  selectChatById(id),             // Switch chat
  clearCurrentChat(),             // Clear messages
  removeChatById(id),             // Delete chat
  renameChatById(id, title),      // Rename chat
  setLoadingState(boolean),       // Set loading
  setErrorMessage(message)        // Set error
} = useChat();
```

---

## 🎨 Modal Prompt Implementation

The modal prompt for new chat creation is already implemented in Home.jsx with:
- ✅ Fade-in animation for overlay
- ✅ Slide-up animation for modal
- ✅ Auto-focus on input field
- ✅ Enter key support
- ✅ Cancel and Create buttons
- ✅ Beautiful styling
- ✅ Click outside to close

---

## 📚 Full Documentation

For detailed documentation, see:
- [REDUX_SETUP.md](./Frontend/REDUX_SETUP.md) - Complete Redux guide
- [REDUX_EXAMPLES.md](./Frontend/REDUX_EXAMPLES.md) - Code examples
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's implemented

---

## ❓ Common Questions

### Q: Do I need to wrap my app with Provider?
**A:** Already done! Check [src/main.jsx](./Frontend/src/main.jsx)

### Q: How do I replace mock responses with real API?
**A:** See REDUX_EXAMPLES.md → Section 5 "API Integration with Redux"

### Q: How do I persist chats to database?
**A:** 
1. On chat creation, call API to save
2. On app load, fetch chats from API
3. Use `setLoadingState` during async operations

### Q: How do I debug Redux state?
**A:** 
1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Go to Redux tab
4. See all state changes and actions

### Q: Should I use the custom hook or Redux directly?
**A:** Use the custom hook (`useChat`) for cleaner code. Only use Redux directly if you need specific selectors.

---

## 🐛 Troubleshooting

### "useChat is not defined"
```javascript
// Make sure to import it
import { useChat } from '../hooks/useChat';
```

### "Redux state is not updating"
1. Check Redux DevTools - is action being dispatched?
2. Verify selector path is correct
3. Ensure component is wrapped with Provider (already done)

### "Modal doesn't appear"
1. Check `showNewChatPrompt` state is true
2. Verify CSS is loaded
3. Check browser console for errors

### "Messages not showing"
1. Verify `addMessage` action is dispatched
2. Check selector `selectMessages` is working
3. Use Redux DevTools to see state

---

## 📦 What's Installed

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    // ... other dependencies
  }
}
```

- **@reduxjs/toolkit**: Modern Redux with simplified setup
- **react-redux**: Official React bindings for Redux

---

## 🎓 Learning Path

1. ✅ **Understand Redux basics** - See REDUX_SETUP.md overview
2. ✅ **See action types** - Review chatSlice.js actions
3. ✅ **Check selectors** - Review selectors.js
4. ✅ **Use custom hook** - Import useChat and use it
5. ✅ **Review examples** - See REDUX_EXAMPLES.md

---

## 🚀 Next Steps

1. **Test the modal** - Click "New Chat" button
2. **Send messages** - Type and hit Enter
3. **Switch chats** - Click chat in sidebar
4. **Integrate API** - Replace mock responses with real API calls
5. **Add persistence** - Save chats to database

---

## 📞 Quick Reference

| Action | Code |
|--------|------|
| Create Chat | `createNewChat('Title')` |
| Send Message | `sendMessage('Text', 'user')` |
| Select Chat | `selectChatById('id')` |
| Delete Chat | `removeChatById('id')` |
| Get Current | `currentChat` |
| Get Messages | `messages` |
| Get All Chats | `chats` |
| Loading | `isLoading` |
| Error | `error` |

---

## 💬 Modal States

```javascript
// Open modal
const [showPrompt, setShowPrompt] = useState(false);

// Show
setShowPrompt(true);

// Hide
setShowPrompt(false);

// Create and close
confirmCreateChat();
setShowPrompt(false);
```

---

**You're all set! 🎉 Start building your chat app!**

For questions, refer to documentation files or Redux Toolkit official docs.
