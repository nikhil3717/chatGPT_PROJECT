// Chat selectors
export const selectCurrentChat = (state) => state.chat.currentChat;
export const selectChats = (state) => state.chat.chats;
export const selectMessages = (state) => state.chat.messages;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectError = (state) => state.chat.error;

// Derived selectors
export const selectChatById = (state, chatId) =>
  state.chat.chats.find((chat) => chat.id === chatId);

export const selectHasChats = (state) => state.chat.chats.length > 0;

export const selectMessagesCount = (state) => state.chat.messages.length;

export const selectUserMessagesCount = (state) =>
  state.chat.messages.filter((m) => m.role === "user").length;

export const selectAssistantMessagesCount = (state) =>
  state.chat.messages.filter((m) => m.role === "assistant").length;

export const selectLastMessage = (state) => {
  const messages = state.chat.messages;
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

export const selectRecentChats = (state, limit = 5) =>
  state.chat.chats.slice(0, limit);

export const selectChatExists = (state, chatId) =>
  state.chat.chats.some((chat) => chat.id === chatId);
