# Redux Chat State Management Documentation

## Overview
This Redux setup manages the entire chat application state including:
- **Current Chat**: The active chat the user is viewing
- **Chats Array**: List of all user chats with metadata
- **Messages**: Messages within the current chat
- **Loading State**: Async operation status
- **Error State**: Error messages for user feedback

## Directory Structure

```
src/
├── redux/
│   ├── store.js              # Redux store configuration
│   ├── slices/
│   │   └── chatSlice.js      # Chat reducer with all actions
│   └── selectors.js          # Reusable state selectors
├── hooks/
│   └── useChat.js            # Custom hook for chat operations
└── pages/
    └── Home.jsx              # Home component using Redux
```

## Redux Architecture

### Store Configuration
The Redux store is configured in `src/redux/store.js`:
```javascript
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
```

### Chat Slice (`src/redux/slices/chatSlice.js`)
Contains all chat-related state and actions using Redux Toolkit.

**Initial State:**
```javascript
{
  currentChat: null,      // { id, title, createdAt }
  chats: [],              // Array of chat objects
  messages: [],           // Messages in current chat
  isLoading: false,       // Async operation state
  error: null             // Error messages
}
```

## Actions

### `createChat(payload)`
Creates a new chat and sets it as current.
```javascript
dispatch(createChat({
  id: 'chat-123',
  title: 'Web Development Help',
  createdAt: '2025-12-12T10:30:00Z'
}));
```

### `addMessage(payload)`
Adds a single message to the current chat.
```javascript
dispatch(addMessage({
  id: 'msg-456',
  text: 'Hello, how can I help?',
  role: 'assistant', // or 'user'
  timestamp: '2025-12-12T10:31:00Z'
}));
```

### `addMessages(payload)`
Adds multiple messages at once.
```javascript
dispatch(addMessages([
  { id: 'msg-1', text: '...', role: 'user' },
  { id: 'msg-2', text: '...', role: 'assistant' }
]));
```

### `setCurrentChat(chatId)`
Sets the active chat.
```javascript
dispatch(setCurrentChat('chat-123'));
```

### `clearMessages()`
Clears all messages from current chat.
```javascript
dispatch(clearMessages());
```

### `loadChat(payload)`
Loads a chat with its messages.
```javascript
dispatch(loadChat({
  chat: { id: 'chat-123', title: '...', createdAt: '...' },
  messages: [...]
}));
```

### `deleteChat(chatId)`
Deletes a chat by ID.
```javascript
dispatch(deleteChat('chat-123'));
```

### `renameChat(payload)`
Renames a chat.
```javascript
dispatch(renameChat({
  id: 'chat-123',
  title: 'New Title'
}));
```

### `setLoading(boolean)`
Sets the loading state.
```javascript
dispatch(setLoading(true));
```

### `setError(errorMessage)`
Sets an error message.
```javascript
dispatch(setError('Failed to send message'));
```

### `loadChats(chatsArray)`
Loads multiple chats.
```javascript
dispatch(loadChats([...]));
```

### `clearAll()`
Clears all state.
```javascript
dispatch(clearAll());
```

## Selectors (`src/redux/selectors.js`)

### Basic Selectors
```javascript
selectCurrentChat(state)      // Get current chat object
selectChats(state)            // Get all chats array
selectMessages(state)         // Get messages in current chat
selectIsLoading(state)        // Get loading state
selectError(state)            // Get error message
```

### Derived Selectors
```javascript
selectChatById(state, chatId)           // Get specific chat
selectHasChats(state)                   // Check if chats exist
selectMessagesCount(state)              // Count total messages
selectUserMessagesCount(state)          // Count user messages
selectAssistantMessagesCount(state)     // Count AI messages
selectLastMessage(state)                // Get last message
selectRecentChats(state, limit)         // Get recent chats
selectChatExists(state, chatId)         // Check if chat exists
```

## Using in Components

### Method 1: useSelector + useDispatch
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { createChat, addMessage } from '../redux/slices/chatSlice';
import { selectCurrentChat, selectMessages } from '../redux/selectors';

const MyComponent = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const messages = useSelector(selectMessages);

  const handleNewChat = () => {
    dispatch(createChat({
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date().toISOString()
    }));
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### Method 2: Custom Hook (Recommended)
```javascript
import { useChat } from '../hooks/useChat';

const MyComponent = () => {
  const {
    currentChat,
    messages,
    chats,
    isLoading,
    createNewChat,
    sendMessage,
    setLoadingState
  } = useChat();

  const handleNewChat = () => {
    createNewChat('My New Chat');
  };

  const handleSendMessage = (text) => {
    sendMessage(text, 'user');
    setLoadingState(true);
    // API call...
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

## Custom Hook: useChat

Located in `src/hooks/useChat.js`, this hook provides a simplified interface to Redux.

### Available Methods:
```javascript
const {
  // State
  currentChat,        // Current active chat
  chats,             // All chats
  messages,          // Messages in current chat
  isLoading,         // Loading state
  error,             // Error message

  // Actions
  createNewChat(title),           // Create new chat
  sendMessage(text, role),        // Add message
  selectChatById(chatId),         // Switch to chat
  clearCurrentChat(),             // Clear messages
  removeChatById(chatId),         // Delete chat
  renameChatById(chatId, title),  // Rename chat
  setLoadingState(boolean),       // Set loading
  setErrorMessage(message)        // Set error
} = useChat();
```

## Integration Setup

### 1. Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux
# or
bun add @reduxjs/toolkit react-redux
```

### 2. Wrap App with Provider
In `src/main.jsx`:
```javascript
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

### 3. Use in Components
Import and use selectors/actions in any component.

## Chat Creation Flow with Modal Prompt

When a user creates a new chat:

1. **Modal Opens**: User clicks "New Chat" button
2. **Prompt Modal**: User enters optional chat title
3. **Confirmation**: User clicks "Create Chat"
4. **Redux Action**: `createChat` action dispatches with chat data
5. **State Update**: 
   - New chat added to `chats` array
   - Set as `currentChat`
   - `messages` array cleared
6. **UI Update**: Components rerender with new state
7. **Modal Closes**: User ready to send messages

### Modal State Management
```javascript
const [showNewChatPrompt, setShowNewChatPrompt] = useState(false);
const [newChatTitle, setNewChatTitle] = useState("");

const handleCreateChat = () => {
  setShowNewChatPrompt(true);
};

const confirmCreateChat = () => {
  const title = newChatTitle.trim() || "New Chat";
  dispatch(createChat({
    id: `chat-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
  }));
  setShowNewChatPrompt(false);
};
```

## Best Practices

1. **Use Selectors**: Always use selectors instead of accessing state directly
2. **Use Custom Hook**: Use `useChat` hook for simplified component code
3. **Normalize IDs**: Always use unique IDs (timestamps or UUIDs)
4. **Handle Loading**: Set `isLoading` during async operations
5. **Error Handling**: Use `setError` to display error messages to users
6. **Persist State**: Consider persisting Redux state to localStorage for chats
7. **Memoize**: Use `useCallback` and `useMemo` to optimize performance

## State Shape Reference

```javascript
{
  chat: {
    currentChat: {
      id: "chat-1702394400000",
      title: "Web Development Discussion",
      createdAt: "2025-12-12T10:30:00.000Z"
    },
    chats: [
      {
        id: "chat-1702394400000",
        title: "Web Development Discussion",
        createdAt: "2025-12-12T10:30:00.000Z"
      },
      // ... more chats
    ],
    messages: [
      {
        id: "msg-1702394460000",
        text: "How do I set up React?",
        role: "user",
        timestamp: "2025-12-12T10:31:00.000Z"
      },
      {
        id: "msg-1702394461000",
        text: "React is a JavaScript library for...",
        role: "assistant",
        timestamp: "2025-12-12T10:31:05.000Z"
      }
    ],
    isLoading: false,
    error: null
  }
}
```

## Debugging Redux

### React Redux DevTools
Install the Redux DevTools browser extension to inspect state changes and actions.

### Console Logging
```javascript
const state = useSelector(state => state);
console.log('Current Redux State:', state);
```

### Track Action Dispatch
```javascript
const dispatch = useDispatch();
console.log('Dispatching action:', action);
dispatch(action);
```

## Future Enhancements

1. **Async Thunks**: Add API calls with `createAsyncThunk`
2. **Persistence**: Save chats to localStorage/database
3. **Real-time Updates**: WebSocket integration for live messages
4. **Pagination**: Load chats on demand for large lists
5. **Search**: Add chat/message search functionality
6. **Backup**: Export/import chat history

## Troubleshooting

### State Not Updating
- Ensure you're using Redux DevTools to verify actions are dispatching
- Check that selectors are correctly accessing the state
- Verify actions are being imported from the correct slice

### Provider Error
- Ensure Redux Provider wraps entire App in `main.jsx`
- Check store import is correct

### Selector Returns Undefined
- Verify the selector path matches your Redux state shape
- Check that state is initialized with data

## Questions & Support

For more information on Redux Toolkit:
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
