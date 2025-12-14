import React from "react";
import "../styles/chatSidebar.css";

const ChatSidebar = ({
  chats,
  currentChatId,
  onSelectChat,
  onCreateChat,
  isOpen,
  onClose,
}) => {
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
            <div className="user-avatar">G</div>
            <div className="user-info">
              <div className="user-name">Nikhil Bca1835</div>
              <div className="user-status">Go</div>
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
