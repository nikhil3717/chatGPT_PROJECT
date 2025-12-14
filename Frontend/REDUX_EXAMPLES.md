# Redux Chat - Practical Code Examples

## 1. Using the Custom Hook (Recommended)

### Basic Chat Component
```javascript
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

const ChatComponent = () => {
  const {
    currentChat,
    messages,
    chats,
    isLoading,
    createNewChat,
    sendMessage,
    selectChatById,
    removeChatById
  } = useChat();

  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue, 'user');
      setInputValue('');
      
      // Simulate AI response
      setTimeout(() => {
        sendMessage(`Response to: ${inputValue}`, 'assistant');
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <h2>{currentChat?.title || 'No Chat Selected'}</h2>
        <button onClick={() => createNewChat('New Chat')}>
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
          >
            <button onClick={() => selectChatById(chat.id)}>
              {chat.title}
            </button>
            <button onClick={() => removeChatById(chat.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Messages Display */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-content">{msg.text}</div>
            <small className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
        {isLoading && <div className="loading">Thinking...</div>}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
```

## 2. Direct Redux Usage

### With useSelector and useDispatch
```javascript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createChat, addMessage, setLoading } from '../redux/slices/chatSlice';
import { selectCurrentChat, selectMessages, selectIsLoading } from '../redux/selectors';

const ChatWithRedux = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);
  const [input, setInput] = useState('');

  const handleCreateNewChat = () => {
    dispatch(createChat({
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date().toISOString()
    }));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    dispatch(addMessage({
      id: `msg-${Date.now()}`,
      text: input,
      role: 'user',
      timestamp: new Date().toISOString()
    }));

    setInput('');
    dispatch(setLoading(true));

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();

      // Add AI response
      dispatch(addMessage({
        id: `msg-${Date.now() + 1}`,
        text: data.reply,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      dispatch(addMessage({
        id: `msg-${Date.now() + 2}`,
        text: 'Error: Could not get response',
        role: 'assistant',
        timestamp: new Date().toISOString()
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <h1>{currentChat?.title}</h1>
      {/* Rest of component */}
    </div>
  );
};

export default ChatWithRedux;
```

## 3. Modal for New Chat Creation

### Chat Creation Modal Component
```javascript
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import '../styles/modalStyles.css';

const NewChatModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const { createNewChat } = useChat();

  if (!isOpen) return null;

  const handleSubmit = () => {
    const chatTitle = title.trim() || 'New Chat';
    createNewChat(chatTitle);
    onClose();
    setTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create New Chat</h2>
        <p>Give your chat a title (optional)</p>
        <input
          type="text"
          className="modal-input"
          placeholder="e.g., Web Development Help"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleSubmit}>
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
```

## 4. Chat Sidebar Component

### Using Redux with Sidebar
```javascript
import React from 'react';
import { useChat } from '../hooks/useChat';

const ChatSidebar = () => {
  const {
    chats,
    currentChat,
    selectChatById,
    removeChatById,
    createNewChat
  } = useChat();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button
          className="new-chat-btn"
          onClick={() => createNewChat()}
        >
          + New Chat
        </button>
      </div>

      <div className="chats-list">
        {chats.length === 0 ? (
          <p className="empty-message">No chats yet. Create one!</p>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${
                currentChat?.id === chat.id ? 'active' : ''
              }`}
            >
              <button
                className="chat-name"
                onClick={() => selectChatById(chat.id)}
              >
                {chat.title}
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  if (window.confirm('Delete this chat?')) {
                    removeChatById(chat.id);
                  }
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
```

## 5. Advanced: API Integration with Redux

### Async Message Sending
```javascript
import { useChat } from '../hooks/useChat';
import { selectError } from '../redux/selectors';
import { useSelector } from 'react-redux';

const ChatWithAPI = () => {
  const {
    currentChat,
    messages,
    isLoading,
    sendMessage,
    setLoadingState,
    setErrorMessage
  } = useChat();
  const error = useSelector(selectError);

  const sendMessageToAPI = async (userMessage) => {
    // Create user message in Redux
    sendMessage(userMessage, 'user');
    setLoadingState(true);
    setErrorMessage(null);

    try {
      // API Call
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          chatId: currentChat?.id,
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Add AI response
      sendMessage(data.reply, 'assistant');
    } catch (err) {
      setErrorMessage(err.message);
      sendMessage(`Error: ${err.message}`, 'assistant');
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="chat">
      {error && <div className="error-message">{error}</div>}
      {/* Messages and input */}
    </div>
  );
};

export default ChatWithAPI;
```

## 6. Selective Rendering Based on Redux State

### Conditional Rendering Examples
```javascript
import { useChat } from '../hooks/useChat';

const ConditionalChat = () => {
  const { chats, currentChat, messages, isLoading } = useChat();

  return (
    <div>
      {/* Show if no chats exist */}
      {chats.length === 0 && (
        <div className="empty-state">
          <p>No chats yet. Create one to get started!</p>
        </div>
      )}

      {/* Show if chat is selected */}
      {currentChat && (
        <div className="chat-view">
          <h1>{currentChat.title}</h1>

          {/* Show if no messages */}
          {messages.length === 0 && (
            <div className="welcome">
              <p>Start a conversation by typing below</p>
            </div>
          )}

          {/* Show messages */}
          {messages.length > 0 && (
            <div className="messages">
              {messages.map(msg => (
                <div key={msg.id} className={msg.role}>
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          {/* Show loading indicator */}
          {isLoading && (
            <div className="loading">
              <span className="spinner"></span> AI is thinking...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConditionalChat;
```

## 7. Using Selectors for Performance Optimization

### Memoized Selectors
```javascript
import { useSelector } from 'react-redux';
import {
  selectChats,
  selectMessagesCount,
  selectRecentChats,
  selectHasChats,
  selectLastMessage
} from '../redux/selectors';

const OptimizedComponent = () => {
  // These selectors are memoized and only trigger re-render
  // when their specific returned value changes
  const chats = useSelector(selectChats);
  const messageCount = useSelector(selectMessagesCount);
  const recentChats = useSelector(state => selectRecentChats(state, 5));
  const hasChats = useSelector(selectHasChats);
  const lastMessage = useSelector(selectLastMessage);

  return (
    <div>
      <h2>Stats</h2>
      <p>Total Chats: {chats.length}</p>
      <p>Messages: {messageCount}</p>
      {hasChats && <p>Last Message: {lastMessage?.text}</p>}
      
      <h3>Recent Chats</h3>
      <ul>
        {recentChats.map(chat => (
          <li key={chat.id}>{chat.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default OptimizedComponent;
```

## 8. Error Handling Example

### Complete Error Handling Flow
```javascript
import { useChat } from '../hooks/useChat';
import { useSelector } from 'react-redux';
import { selectError } from '../redux/selectors';

const ChatWithErrorHandling = () => {
  const {
    currentChat,
    messages,
    isLoading,
    sendMessage,
    setLoadingState,
    setErrorMessage,
    createNewChat
  } = useChat();
  const error = useSelector(selectError);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    try {
      // Clear previous errors
      setErrorMessage(null);

      if (!input.trim()) {
        setErrorMessage('Message cannot be empty');
        return;
      }

      if (!currentChat) {
        createNewChat();
      }

      setLoadingState(true);

      // Send message
      sendMessage(input, 'user');
      setInput('');

      // Simulate API call
      const response = await mockAPICall(input);

      if (response.ok) {
        sendMessage(response.data, 'assistant');
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="chat">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setErrorMessage(null)}>✕</button>
        </div>
      )}

      {/* Messages */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatWithErrorHandling;
```

## Tips & Tricks

### ✅ Best Practice: Always use selectors
```javascript
// ✅ Good
const messages = useSelector(selectMessages);

// ❌ Avoid
const messages = useSelector(state => state.chat.messages);
```

### ✅ Best Practice: Use custom hook for cleaner code
```javascript
// ✅ Good
const { currentChat, messages } = useChat();

// ❌ Less clean
const dispatch = useDispatch();
const currentChat = useSelector(selectCurrentChat);
const messages = useSelector(selectMessages);
```

### ✅ Best Practice: Generate unique IDs consistently
```javascript
// ✅ Good
const id = `msg-${Date.now()}`;
const id = `chat-${Date.now()}`;

// ❌ Avoid
const id = Math.random().toString();
```

### ✅ Best Practice: Handle loading and errors
```javascript
// ✅ Good
setLoadingState(true);
try {
  // async work
} catch (error) {
  setErrorMessage(error.message);
} finally {
  setLoadingState(false);
}
```

---

**Happy Coding! 🚀**
