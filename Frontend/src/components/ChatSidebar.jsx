import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import "../styles/chatSidebar.css";

const ChatSidebar = ({
  chats,
  currentChatId,
  onSelectChat,
  onCreateChat,
  isOpen,
  onClose,
}) => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );
        if (mounted) setUser(res.data.user);
      } catch (err) {
        if (mounted) setUser(null);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <aside
        className={`chat-sidebar ${isOpen ? "open" : ""}`}
        aria-label="Chat list"
      >
        <div className="sidebar-header">
          <button
            className="new-chat-button"
            onClick={onCreateChat}
            aria-label="Create new chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V14M2 8H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>New chat</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Your chats</h3>
            <ul
              className="chat-list"
              role="listbox"
              aria-label="Previous chats"
            >
              {chats?.map((chat) => (
                <li key={chat.id}>
                  <button
                    className={`chat-list-item ${chat.id === currentChatId ? "active" : ""
                      }`}
                    onClick={() => onSelectChat(chat.id)}
                    aria-selected={chat.id === currentChatId}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="chat-icon"
                    >
                      <path
                        d="M2 4H14M2 8H14M2 12H10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="chat-title">
                      {chat.title || "New chat"}
                    </span>
                  </button>
                </li>
              ))}
              {chats?.length === 0 && (
                <li className="chat-empty">No recent chats</li>
              )}
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{user ? user.firstName?.[0] ?? "U" : "G"}</div>
            <div className="user-info">
              <div className="user-name">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</div>
              <div className="user-status">{user ? "Online" : "Not signed in"}</div>
            </div>
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
          {user ? (
            <button className="auth-button logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="auth-button login-button">
              Login
            </Link>
          )}
        </div>
      </aside>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close chat list"
        />
      )}
    </>
  );
};

export default ChatSidebar;
