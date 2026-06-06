import React, { useEffect, useState } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import "../styles/chatLayout.css";

import {
  createChat,
  addMessage,
  addMessages,
  clearMessages,
  setLoading,
  setChat,
  setCurrentChat,
  loadChat,
} from "../redux/slices/chatSlice";

import {
  selectCurrentChat,
  selectChats,
  selectMessages,
  selectIsLoading,
} from "../redux/selectors";

import axios from "axios";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../config/api";
const Home = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const currentChat = useSelector(selectCurrentChat);
  const chats = useSelector(selectChats);
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);


  const [ActiveChat, setActiveChat] = useState(false)

  // Local state
  const [inputText, setInputText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewChatPrompt, setShowNewChatPrompt] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const [Socket, setSocket] = useState(null)

  // Fetch chats from server
  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat`, {
        withCredentials: true
      });
      console.log("Fetched chats:", response.data);

      // Map backend response format (_id) to frontend format (id)
      const formattedChats = (response.data.chat.reverse() || []).map(chat => ({
        id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        createdAt: chat.createdAt
      }));

      console.log("Formatted chats:", formattedChats);
      dispatch(setChat(formattedChats));
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Create new chat with prompt
  const handleCreateChat = () => {
    if (isCreatingChat) return;
    setShowNewChatPrompt(true);
    setNewChatTitle("");
  };

  // Confirm new chat creation
  const confirmCreateChat = async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    const title = newChatTitle.trim() || "New Chat";

    try {
      let response = await axios.post(`${API_BASE_URL}/api/chat`, {
        title: title
      }, {
        withCredentials: true
      });

      console.log(response.data.chat);

      // Load the newly created chat directly
      dispatch(
        loadChat({
          chat: response.data.chat,
          messages: []
        })
      );

      // Then fetch updated chats list from server
      await fetchChats();

      setShowNewChatPrompt(false);
      setNewChatTitle("");
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setTimeout(() => setIsCreatingChat(false), 300);
    }
  };




  const getMessages = async (chatId) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/chat/messages/${chatId}`,
        { withCredentials: true }
      );

      const AllMessages = Array.isArray(data.message) ? data.message : [];

      // Map backend message shape to frontend message shape
      const mapped = AllMessages.map((m) => ({
        id: m._id,
        text: m.content,
        role: m.role === "model" ? "assistant" : m.role,
        timestamp: m.createdAt || m.updatedAt || new Date().toISOString(),
      }));

      // Replace messages in store for the selected chat
      dispatch(clearMessages());
      if (mapped.length) dispatch(addMessages(mapped));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }

  }



  // Select existing chat
  const selectChat = (chatId) => {
    dispatch(setCurrentChat(chatId));
    setIsSidebarOpen(false);
    getMessages(chatId)
  };


  useEffect(() => {
    fetchChats();
  }, [dispatch])

  // Initialize socket connection separately
  useEffect(() => {
    let tempSocket = io(API_BASE_URL, {
      withCredentials: true,
    });

    tempSocket.on("ai-response", (response) => {
      console.log("Receive AI response:", response);

      // Validate response format
      if (!response || typeof response !== 'object') {
        console.error("Invalid response format:", response);
        dispatch(setLoading(false));
        return;
      }

      if (response.error) {
        console.error("Error from AI:", response.content);
        dispatch(setLoading(false));
        return;
      }

      // Ensure content is a string
      const messageContent = String(response.content || "");

      if (!messageContent.trim()) {
        console.error("Empty message content");
        dispatch(setLoading(false));
        return;
      }

      console.log("Adding assistant message:", messageContent);

      dispatch(
        addMessage({
          id: `msg-${Date.now()}`,
          text: messageContent,
          role: "assistant",
          timestamp: new Date().toISOString(),
        })
      );
      dispatch(setLoading(false));
    });

    tempSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    tempSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    tempSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(tempSocket);

    return () => {
      tempSocket.disconnect();
    };
  }, [dispatch]);

  const sendMessage = (textOverride) => {
    const text = (textOverride ?? inputText).trim();
    if (!text) return;

    // Wait for socket to be ready
    if (!Socket) {
      console.error("Socket not initialized yet");
      return;
    }

    // If no current chat, select the first chat
    if (!currentChat) {
      if (chats.length === 0) {
        console.error("No chats available");
        return;
      }
      dispatch(setCurrentChat(chats[0].id));
      return;
    }

    Socket.emit("ai-message", {
      chat: currentChat.id,
      content: text
    });

    setInputText("");
    dispatch(setLoading(true));

    // Add user message to local state
    dispatch(
      addMessage({
        id: `msg-${Date.now()}`,
        text,
        role: "user",
        timestamp: new Date().toISOString(),
      })
    );
  };



  return (
    <section className="chat-shell">
      <div className="top-bar">
        <div className="top-bar-left">
          <button
            className="icon-btn menu-toggle"
            aria-label="Toggle chat list"
            onClick={() => setIsSidebarOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="logo-section">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="brain-icon"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="currentColor"
              />
            </svg>
            <h1>ChatGPT 5.1</h1>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="chevron-down"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="icon-btn" aria-label="Add user">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                fill="currentColor"
              />
              <path
                d="M10 12C5.58172 12 2 13.7909 2 16V20H18V16C18 13.7909 14.4183 12 10 12Z"
                fill="currentColor"
              />
              <path
                d="M17 8V12M15 10H19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Refresh">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17.5 2.5V7.5H12.5M2.5 17.5V12.5H7.5M17.5 17.5L14.1667 14.1667C13.3333 15 12.1667 15.5 11 15.5C7.96243 15.5 5.5 13.0376 5.5 10C5.5 6.96243 7.96243 4.5 11 4.5M2.5 2.5L5.83333 5.83333C6.66667 5 7.83333 4.5 9 4.5C12.0376 4.5 14.5 6.96243 14.5 10C14.5 13.0376 12.0376 15.5 9 15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="chat-layout">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChat?.id}
          onSelectChat={selectChat}
          onCreateChat={handleCreateChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <ChatWindow
          chatTitle={currentChat?.title || "Chat"}
          messages={messages}
          inputText={inputText}
          onInputChange={setInputText}
          onSend={sendMessage}
          isLoading={isLoading}
          hasActiveChat={!!currentChat}
        />
      </div>

      {/* New Chat Prompt Modal */}
      {showNewChatPrompt && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewChatPrompt(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Create New Chat</h2>
            <p>Give your chat a title (optional)</p>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g., Web Development Help, Code Review..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isCreatingChat && confirmCreateChat()
              }
              autoFocus
            />
            <div className="modal-buttons">
              <button
                className="modal-btn cancel-btn"
                onClick={() => !isCreatingChat && setShowNewChatPrompt(false)}
                disabled={isCreatingChat}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm-btn"
                onClick={confirmCreateChat}
                disabled={isCreatingChat}
              >
                {isCreatingChat ? "Creating..." : "Create Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;