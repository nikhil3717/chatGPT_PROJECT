import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null, // { id, title, createdAt }
  chats: [], // array of { id, title, createdAt }
  messages: [], // messages in current chat
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Create new chat
    createChat: (state, action) => {
      const newChat = {
        id: action.payload.id || Date.now().toString(),
        title: action.payload.title || "New Chat",
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.chats.unshift(newChat); // Add to beginning of array
      state.currentChat = newChat;
      state.messages = []; // Reset messages for new chat
    },

    // Set current chat
    setCurrentChat: (state, action) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        state.currentChat = chat;
        state.messages = action.payload.messages || []; // Load messages for this chat
      }
    },

    setChat: (state,action) => {
      state.chats = action.payload
    },

    // Add message to current chat
    addMessage: (state, action) => {
      const message = {
        id: action.payload.id || Date.now().toString(),
        text: action.payload.text,
        role: action.payload.role, // "user" or "assistant"
        timestamp: action.payload.timestamp || new Date().toISOString(),
      };
      state.messages.push(message);

      // Update current chat's title if it's the first user message
      if (
        state.currentChat &&
        state.messages.filter((m) => m.role === "user").length === 1 &&
        message.role === "user"
      ) {
        state.currentChat.title = message.text.substring(0, 50); // First 50 chars as title
        const chatIndex = state.chats.findIndex(
          (c) => c.id === state.currentChat.id
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex].title = state.currentChat.title;
        }
      }
    },

    // Add multiple messages
    addMessages: (state, action) => {
      const newMessages = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.messages.push(...newMessages);
    },

    // Delete message
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },

    // Clear messages
    clearMessages: (state) => {
      state.messages = [];
    },

    // Load chat with messages
    loadChat: (state, action) => {
      state.currentChat = action.payload.chat;
      state.messages = action.payload.messages || [];
    },

    // Delete chat
    deleteChat: (state, action) => {
      state.chats = state.chats.filter((c) => c.id !== action.payload);
      if (state.currentChat?.id === action.payload) {
        state.currentChat = state.chats[0] || null;
        state.messages = [];
      }
    },

    // Rename chat
    renameChat: (state, action) => {
      const chat = state.chats.find((c) => c.id === action.payload.id);
      if (chat) {
        chat.title = action.payload.title;
      }
      if (state.currentChat?.id === action.payload.id) {
        state.currentChat.title = action.payload.title;
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Load all chats
    loadChats: (state, action) => {
      state.chats = action.payload;
    },

    // Clear all
    clearAll: (state) => {
      state.currentChat = null;
      state.chats = [];
      state.messages = [];
      state.error = null;
    },
  },
});

export const {
  createChat,
  setCurrentChat,
  setChat,
  addMessage,
  addMessages,
  deleteMessage,
  clearMessages,
  loadChat,
  deleteChat,
  renameChat,
  setLoading,
  setError,
  loadChats,
  clearAll,
} = chatSlice.actions;

export default chatSlice.reducer;
