import { useDispatch, useSelector } from "react-redux";
import {
  createChat,
  addMessage,
  setCurrentChat,
  clearMessages,
  deleteChat,
  renameChat,
  setLoading,
  setError,
} from "../redux/slices/chatSlice";
import {
  selectCurrentChat,
  selectChats,
  selectMessages,
  selectIsLoading,
  selectError,
} from "../redux/selectors";

/**
 * Custom hook for managing chat operations
 * Provides a simple interface to interact with Redux chat state
 */
export const useChat = () => {
  const dispatch = useDispatch();

  // Selectors
  const currentChat = useSelector(selectCurrentChat);
  const chats = useSelector(selectChats);
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Actions
  const createNewChat = (title = "New Chat") => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
    };
    dispatch(createChat(newChat));
    return newChat;
  };

  const sendMessage = (text, role = "user") => {
    const message = {
      id: `msg-${Date.now()}`,
      text,
      role,
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(message));
    return message;
  };

  const selectChatById = (chatId) => {
    dispatch(setCurrentChat(chatId));
  };

  const clearCurrentChat = () => {
    dispatch(clearMessages());
  };

  const removeChatById = (chatId) => {
    dispatch(deleteChat(chatId));
  };

  const renameChatById = (chatId, newTitle) => {
    dispatch(renameChat({ id: chatId, title: newTitle }));
  };

  const setLoadingState = (loading) => {
    dispatch(setLoading(loading));
  };

  const setErrorMessage = (errorMessage) => {
    dispatch(setError(errorMessage));
  };

  return {
    // State
    currentChat,
    chats,
    messages,
    isLoading,
    error,

    // Actions
    createNewChat,
    sendMessage,
    selectChatById,
    clearCurrentChat,
    removeChatById,
    renameChatById,
    setLoadingState,
    setErrorMessage,
  };
};

export default useChat;
