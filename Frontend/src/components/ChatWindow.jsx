import React,
  {
  useEffect,
  useRef
}

from "react";

import {
  useDispatch
}

from "react-redux";

import {
  deleteMessage
}

from "../redux/slices/chatSlice";
import "../styles/chatWindow.css";

const ChatWindow=( {
    chatTitle,
    messages,
    inputText,
    onInputChange,
    onSend,
    isLoading,
    hasActiveChat
  }

)=> {
  const listRef=useRef(null);
  const inputRef=useRef(null);
  const dispatch=useDispatch();

  useEffect(()=> {
      if (listRef.current) {
        listRef.current.scrollTop=listRef.current.scrollHeight;
      }
    }

    , [messages, isLoading]);

  useEffect(()=> {
      if (inputRef.current) {
        inputRef.current.style.height="auto";

        inputRef.current.style.height=`$ {
          inputRef.current.scrollHeight
        }

        px`;
      }
    }

    , [inputText]);

  const handleKeyDown=(e)=> {
    if (e.key==="Enter"&& !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  ;

  const isEmpty=messages.length===0;

  return (<main className="chat-window"aria-live="polite"> <div className= {
      `chat-messages $ {
        isEmpty ? "is-empty" : ""
      }

      `
    }

    ref= {
      listRef
    }

    > {
      isEmpty && (<div className="chat-empty-hero"> <h1>What are you working on?</h1> <p>Describe a task, paste code, or ask anything to get a response.</p> </div>)
    }

      {
      messages.map((msg)=> (<div key= {
            msg.id
          }

          className= {
            `message-wrapper $ {
              msg.role
            }

            `
          }

          > <div className="message-avatar"> {
            msg.role==="assistant"? (<svg width="24"height="24"viewBox="0 0 24 24"fill="none"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
              /> </svg>) : (<svg width="24"height="24"viewBox="0 0 24 24"fill="none"> <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="currentColor"
              /> </svg>)
          }

          </div> <div className= {
            `chat-bubble $ {
              msg.role
            }

            `
          }

          > <div className="message-content"> {
            msg.text
          }

          </div> <button className="message-delete-btn"

          onClick= {
            ()=> dispatch(deleteMessage(msg.id))
          }

          title="Delete message"
          > × </button> </div> </div>))
    }

      {
      isLoading && (<div className="message-wrapper assistant"> <div className="message-avatar"> <svg width="24"height="24"viewBox="0 0 24 24"fill="none"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="currentColor"
        /> </svg> </div> <div className="chat-bubble assistant typing-indicator"> <div className="typing-dots"> <span></span> <span></span> <span></span> </div> </div> </div>)
    }

    </div>
    
   { hasActiveChat &&  (<div className= {
      `chat-input-container $ {
        isEmpty ? "floating" : ""
      }

      `
    }

    > 
    
    <form className="chat-input-bar"

    onSubmit= {
      (e)=> {
        e.preventDefault();
        onSend();
      }
    }

    > <div className="input-wrapper"> <button className="attach-button"
    type="button"
    aria-label="Attach file"
    > <svg width="20"height="20"viewBox="0 0 20 20"fill="none"> <path d="M10 2V18M2 10H18"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"

    /> </svg> </button> <textarea ref= {
      inputRef
    }

    id="chat-input"

    value= {
      inputText
    }

    onChange= {
      (e)=> onInputChange(e.target.value)
    }

    onKeyDown= {
      handleKeyDown
    }

    placeholder="Ask anything"

    rows= {
      1
    }

    style= {
        {
        height: "auto",
        maxHeight: "200px",
        overflowY: "auto",
      }
    }

    /> <button className="mic-button"
    type="button"
    aria-label="Voice input"
    > <svg width="20"height="20"viewBox="0 0 20 20"fill="none"> <path d="M10 1C8.89543 1 8 1.89543 8 3V9C8 10.1046 8.89543 11 10 11C11.1046 11 12 10.1046 12 9V3C12 1.89543 11.1046 1 10 1Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    /> <path d="M5 9C5 11.7614 7.23858 14 10 14C12.7614 14 15 11.7614 15 9M10 14V17M7 17H13"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    /> </svg> </button> <button className="send-button"
    type="submit"

    disabled= {
      isLoading || !inputText.trim()
    }

    aria-label="Send message"
    > <svg width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    > <path d="M2.5 10L17.5 10M17.5 10L11.6667 3.33333M17.5 10L11.6667 16.6667"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"

    /> </svg> </button> </div> </form> {
    !isEmpty && (<p className="input-footer"> ChatGPT can make mistakes. Check important info. </p>)
    }

    </div>) }
     </main>);
}

;

export default ChatWindow;