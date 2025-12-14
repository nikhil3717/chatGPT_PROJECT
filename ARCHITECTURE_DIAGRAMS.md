# Redux Chat Architecture & Flow Diagrams

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React App                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Redux Provider (src/main.jsx)                │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │           App.jsx (Root Component)             │  │   │
│  │  │  ┌──────────────────────────────────────────┐  │  │   │
│  │  │  │        AppRouters.jsx                     │  │  │   │
│  │  │  │  ┌────────────────────────────────────┐  │  │  │   │
│  │  │  │  │      Home.jsx (Chat Page)           │  │  │  │   │
│  │  │  │  │  ┌──────────────────────────────┐  │  │  │  │   │
│  │  │  │  │  │  ChatSidebar  │ ChatWindow   │  │  │  │  │   │
│  │  │  │  │  │               │              │  │  │  │  │   │
│  │  │  │  │  │  - Chat List  │ - Messages   │  │  │  │  │   │
│  │  │  │  │  │  - New Chat   │ - Input      │  │  │  │  │   │
│  │  │  │  │  │  - Modal      │ - Send Btn   │  │  │  │  │   │
│  │  │  │  │  └──────────────────────────────┘  │  │  │  │   │
│  │  │  │  └────────────────────────────────────┘  │  │  │   │
│  │  │  └──────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Redux Store (Redux)
                            ↓
         ┌──────────────────────────────────┐
         │      Redux Slice (chatSlice)      │
         │  • Reducers                       │
         │  • Actions (13 total)             │
         │  • Initial State                  │
         └──────────────────────────────────┘
                            ↓
                   Redux Selectors
                            ↓
         ┌──────────────────────────────────┐
         │      Custom Hook (useChat)        │
         │  • State values                   │
         │  • Dispatch methods               │
         └──────────────────────────────────┘
                            ↓
                       Components
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│          (Click button, Type text, etc.)                     │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Component Handler                          │
│              (onClick, onChange, etc.)                       │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Dispatch Redux Action                       │
│    dispatch(createChat({...}))                              │
│    dispatch(addMessage({...}))                              │
│    dispatch(setLoading(true))                               │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Redux Slice Reducer                          │
│            (Process action in chatSlice)                     │
│     case: "createChat"                                       │
│     case: "addMessage"                                       │
│     case: "setLoading"                                       │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Redux State Updated                         │
│           (New state object created)                         │
│  {                                                           │
│    currentChat: {...},                                      │
│    messages: [...],                                         │
│    isLoading: true/false                                    │
│  }                                                           │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Redux Selectors Extract Data                    │
│     selectCurrentChat()                                      │
│     selectMessages()                                         │
│     selectIsLoading()                                        │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│             Components Re-render with New Data              │
│        (useSelector triggers component update)              │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      UI Updates                              │
│      (DOM reflects new state values)                         │
│   • Messages display                                         │
│   • Chat list updates                                        │
│   • Loading indicator shows                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Redux Store Structure

```
Redux Store
│
└── state: {
    │
    └── chat: {
        │
        ├── currentChat: {
        │   ├── id: "chat-1702394400000"
        │   ├── title: "Web Development Help"
        │   └── createdAt: "2025-12-12T10:30:00Z"
        │
        ├── chats: [
        │   ├── {
        │   │   ├── id: "chat-1702394400000"
        │   │   ├── title: "Web Development Help"
        │   │   └── createdAt: "2025-12-12T10:30:00Z"
        │   │},
        │   ├── {
        │   │   ├── id: "chat-1702394300000"
        │   │   ├── title: "React Questions"
        │   │   └── createdAt: "2025-12-12T10:20:00Z"
        │   │},
        │   └── ...
        │]
        │
        ├── messages: [
        │   ├── {
        │   │   ├── id: "msg-1702394460000"
        │   │   ├── text: "How do I use Redux?"
        │   │   ├── role: "user"
        │   │   └── timestamp: "2025-12-12T10:31:00Z"
        │   │},
        │   ├── {
        │   │   ├── id: "msg-1702394461000"
        │   │   ├── text: "Redux is a state management..."
        │   │   ├── role: "assistant"
        │   │   └── timestamp: "2025-12-12T10:31:05Z"
        │   │},
        │   └── ...
        │]
        │
        ├── isLoading: false
        │
        └── error: null
    }
}
```

---

## 🎯 Action Flow Examples

### Example 1: Creating a New Chat

```
User clicks "New Chat"
         ↓
Modal appears
         ↓
User enters title: "Web Development"
         ↓
User clicks "Create Chat"
         ↓
dispatch(createChat({
  id: "chat-1702394400000",
  title: "Web Development",
  createdAt: "2025-12-12T10:30:00Z"
}))
         ↓
Reducer (chatSlice.createChat):
  • Add chat to chats array
  • Set as currentChat
  • Clear messages array
         ↓
State Updated
         ↓
useSelector triggers
         ↓
Components re-render
         ↓
UI shows new chat in sidebar
UI shows empty chat window
Modal closes
```

---

### Example 2: Sending a Message

```
User types: "Hello!"
         ↓
User clicks Send or presses Enter
         ↓
dispatch(addMessage({
  id: "msg-1702394460000",
  text: "Hello!",
  role: "user",
  timestamp: "2025-12-12T10:31:00Z"
}))
         ↓
dispatch(setLoading(true))
         ↓
Reducer updates:
  • Adds message to messages array
  • Sets isLoading to true
         ↓
State Updated
         ↓
useSelector triggers
         ↓
Components re-render
         ↓
UI shows:
  • Message in chat window
  • Loading indicator
         ↓
API Call (mock timeout)
         ↓
dispatch(addMessage({...AI response...}))
         ↓
dispatch(setLoading(false))
         ↓
State Updated again
         ↓
Components re-render
         ↓
UI shows:
  • AI response message
  • Loading indicator gone
```

---

## 🪝 Hook Flow Diagram

```
┌──────────────────────────────────┐
│        useChat() Hook             │
├──────────────────────────────────┤
│                                   │
│  useDispatch()                    │
│  ├─→ dispatch actions             │
│  └─→ triggers reducers            │
│                                   │
│  useSelector()                    │
│  ├─→ selectCurrentChat()          │
│  ├─→ selectMessages()             │
│  ├─→ selectChats()                │
│  ├─→ selectIsLoading()            │
│  └─→ selectError()                │
│                                   │
│  Return Object:                   │
│  {                                │
│    // State                       │
│    currentChat,                   │
│    messages,                      │
│    chats,                         │
│    isLoading,                     │
│    error,                         │
│                                   │
│    // Actions                     │
│    createNewChat(title),          │
│    sendMessage(text, role),       │
│    selectChatById(id),            │
│    removeChatById(id),            │
│    renameChatById(id, title),     │
│    clearCurrentChat(),            │
│    setLoadingState(bool),         │
│    setErrorMessage(msg)           │
│  }                                │
│                                   │
└──────────────────────────────────┘
           ↓
    Component Usage
           ↓
const { currentChat, messages, createNewChat } = useChat();
```

---

## 🎨 Modal Creation Flow

```
┌─────────────────────────────────┐
│  User clicks "New Chat" button   │
└────────────┬────────────────────┘
             ↓
    ┌────────────────────┐
    │ setShowNewChatPrompt(true)
    └────────────┬───────┘
             ↓
┌──────────────────────────────────┐
│   Modal Overlay Appears           │
│   - Fade-in animation             │
│   - Takes full screen             │
│   - Click outside to close        │
└──────────────┬───────────────────┘
             ↓
┌──────────────────────────────────┐
│   Modal Content Shows             │
│   - Slide-up animation            │
│   - Input field auto-focused      │
│   - Cancel & Create buttons       │
└──────────────┬───────────────────┘
             ↓
   User enters title (optional)
             ↓
   ┌─ Press Enter ───┐
   │                 │
   ↓                 ↓
 Confirm         Cancel
   │                 │
   ↓                 ↓
dispatch()      setShowNewChatPrompt(false)
createChat()
   │
   ↓
setShowNewChatPrompt(false)
   │
   ↓
┌──────────────────────────────────┐
│   Modal Closes                    │
│   - Fade-out animation            │
│   - Chat created in Redux         │
│   - Chat displayed in sidebar     │
│   - Ready for messages            │
└──────────────────────────────────┘
```

---

## 📊 Component Dependency Tree

```
<App/>
  └─ <Provider store={store}>
      └─ <AppRouters/>
          ├─ <Home/>  ← Uses Redux
          │   ├─ useChat hook
          │   │   ├─ useDispatch()
          │   │   └─ useSelector()
          │   │
          │   ├─ <ChatSidebar/>
          │   │   └─ Props from useChat
          │   │
          │   ├─ <ChatWindow/>
          │   │   └─ Props from useChat
          │   │
          │   └─ Modal JSX
          │       └─ Local state
          │
          ├─ <Login/>
          └─ <Register/>
```

---

## 🔄 State Update Cycle

```
Initial State (Empty)
│
│  ├─ currentChat: null
│  ├─ chats: []
│  ├─ messages: []
│  ├─ isLoading: false
│  └─ error: null
│
↓ User creates first chat
│
│  ├─ currentChat: {id, title, ...}
│  ├─ chats: [{id, title, ...}]
│  ├─ messages: []
│  ├─ isLoading: false
│  └─ error: null
│
↓ User sends message
│
│  ├─ currentChat: {id, title, ...}
│  ├─ chats: [{id, title, ...}, ...]
│  ├─ messages: [{id, text, role, ...}]
│  ├─ isLoading: true
│  └─ error: null
│
↓ AI responds
│
│  ├─ currentChat: {id, title, ...}
│  ├─ chats: [{id, title, ...}, ...]
│  ├─ messages: [{...}, {...}]
│  ├─ isLoading: false
│  └─ error: null
│
↓ User creates another chat
│
│  ├─ currentChat: {id: "new", title: ..}
│  ├─ chats: [{new}, {old}, ...]
│  ├─ messages: []
│  ├─ isLoading: false
│  └─ error: null
```

---

## 🛠️ Redux Toolkit vs Plain Redux

```
┌──────────────────────────────────────┐
│   Redux Toolkit (What We Use) ✅      │
├──────────────────────────────────────┤
│                                       │
│  ✓ createSlice() - Simplified setup  │
│  ✓ configureStore() - Easy config    │
│  ✓ Immer integration - Immutability  │
│  ✓ Built-in DevTools support        │
│  ✓ Less boilerplate                 │
│  ✓ Better DX                         │
│                                       │
│  Code Example:                        │
│  const chatSlice = createSlice({     │
│    name: "chat",                      │
│    initialState,                      │
│    reducers: {                        │
│      createChat(state, action) {     │
│        state.chats.push(...)         │
│      }                                │
│    }                                  │
│  });                                  │
│                                       │
└──────────────────────────────────────┘
```

---

## 🎯 Selector Memoization

```
Without Memoization:
  selectMessages(state) -> state.chat.messages
  • Returns new array reference every time
  • Causes unnecessary component re-renders
  • ❌ Performance issue

With Memoization (What We Have):
  export const selectMessages = (state) => state.chat.messages;
  
  • Selector is pure function
  • Returns same reference if value unchanged
  • React compares by reference
  • Only re-renders if actual data changed
  • ✅ Better performance

Usage:
  const messages = useSelector(selectMessages);
  // Only re-renders when messages actually change
```

---

## 📈 Scalability Pattern

```
Current Structure:
├── redux/
│   ├── store.js          (1 store, all slices)
│   ├── slices/
│   │   └── chatSlice.js  (1 slice for chats)
│   └── selectors.js      (1 file for selectors)

Future Structure (If Needed):
├── redux/
│   ├── store.js
│   ├── slices/
│   │   ├── chatSlice.js
│   │   ├── userSlice.js
│   │   ├── authSlice.js
│   │   └── uiSlice.js
│   ├── selectors/
│   │   ├── chatSelectors.js
│   │   ├── userSelectors.js
│   │   ├── authSelectors.js
│   │   └── uiSelectors.js
│   └── thunks/           (Async operations)
│       ├── chatThunks.js
│       └── userThunks.js

This pattern scales as your app grows!
```

---

## 🧪 Redux DevTools Inspection

```
Redux DevTools Shows:
│
├─ Actions Tab
│  └─ Shows all dispatched actions
│     ├─ chat/createChat
│     ├─ chat/addMessage
│     ├─ chat/setLoading
│     └─ ...
│
├─ State Tab
│  └─ Shows complete state object
│     {
│       chat: {
│         currentChat: {...},
│         chats: [...],
│         ...
│       }
│     }
│
├─ Diff Tab
│  └─ Shows what changed between states
│     ├─ Added: chats[0]
│     ├─ Modified: currentChat
│     └─ ...
│
└─ Time Travel
   └─ Jump to any previous state
      ├─ Click action to go back
      └─ See entire history
```

---

**These diagrams show the complete Redux architecture and data flow! 🎉**
