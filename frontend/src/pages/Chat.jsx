import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import '../App.css';
import { 
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BotIcon from '@mui/icons-material/SmartToy';
import { websocketService } from '../services/websocket';

const Chat = () => {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [messagesPerChat, setMessagesPerChat] = useState([[]]);
  const [selectedAssistant] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [editingCfeedIdx, setEditingCfeedIdx] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    websocketService.connect();
    
    // Add message handler
    const handleMessage = (data) => {
      if (data.type === 'message') {
        const newMessage = {
          sender: data.sender,
          text: data.content,
          position: 'incoming',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessagesPerChat(prev => {
          const updated = [...prev];
          updated[selected] = [...(updated[selected] || []), newMessage];
          return updated;
        });

        setCurrentMessages(prev => [...prev, newMessage]);
      }
    };

    websocketService.addMessageHandler(handleMessage);

    // Cleanup
    return () => {
      websocketService.removeMessageHandler(handleMessage);
      websocketService.disconnect();
    };
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Update current messages when selected chat changes
  useEffect(() => {
    if (selected !== null && messagesPerChat[selected]) {
      setCurrentMessages(messagesPerChat[selected]);
    } else {
      setCurrentMessages([]);
    }
  }, [selected, messagesPerChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  const handleSend = (content) => {
    if (!content.trim() || selected === null) return;

    // User message
    const userMessage = {
      sender: 'You',
      text: content,
      position: 'outgoing',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages for this chat
    setMessagesPerChat(prev => {
      const updated = [...prev];
      updated[selected] = [...(updated[selected] || []), userMessage];
      return updated;
    });

    // Update current messages
    setCurrentMessages(prev => [...prev, userMessage]);

    // Send message through WebSocket
    websocketService.sendMessage(content);

    // Clear input
    setInput('');
  };

  return (
    <Box className="page-container">
      <Box className="chat-grid-root">
        {/* Top row: History title and Assistant selector */}
        <Box className="chat-grid-top-left">
          <span className="chat-history-title">History</span>
        </Box>
        <Box className="chat-grid-top-right">
          <div className="assistant-select-wrapper" ref={dropdownRef}>
            <div
              className="assistant-selected-name"
              tabIndex={0}
              onClick={() => setDropdownOpen((open) => !open)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDropdownOpen((open) => !open); }}
              role="button"
              aria-label="Change assistant"
            >
              {selectedAssistant ? selectedAssistant.name : 'Select Assistant'}
            </div>
            {dropdownOpen && (
              <div className="assistant-dropdown">
                {/* Assistant options will be loaded from backend in the next step */}
                <div className="assistant-dropdown-add">
                  <AddCircleOutlineIcon className="plus-icon" fontSize="small" />
                  <span className="assistant-dropdown-add-text">Add Assistant</span>
                </div>
              </div>
            )}
          </div>
        </Box>

        {/* Second row: Chat history sidebar and main chat area */}
        <Box className="chat-grid-history">
            <Box className="chat-sidebar-list">
              {/* No chat history for now */}
            </Box>
        </Box>

        {/* Main chat area */}
          {selected !== null ? (
            <Box className="chat-main">
              {/* Messages area */}
              <Box className="chat-main-messages">
                {currentMessages.map((msg, idx) => (
                  <Box key={idx}>
                    {msg.type === 'cfeed' ? (
                      <CfeedBubble
                        cfeedType={msg.cfeedType}
                        content={msg.content}
                        position='left'
                        editing={editingCfeedIdx === idx}
                        onApprove={() => handleCfeedApprove(idx)}
                        onEdit={() => handleCfeedEdit(idx)}
                        onDecline={() => handleCfeedDecline(idx)}
                        onSaveEdit={(newContent) => handleCfeedSaveEdit(idx, newContent)}
                        onCancelEdit={handleCfeedCancelEdit}
                      />
                    ) : (
                      <Box className={`message-bubble-wrapper-${msg.position === 'outgoing' ? 'right' : 'left'}`}> 
                        <Box className={`message-bubble-${msg.position === 'outgoing' ? 'right' : 'left'}`}>
                          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>
                            {msg.sender} • {msg.time}
                          </div>
                          {msg.text}
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Input area */}
              <Box className="chat-main-input">
                <div style={{ 
                  display: 'flex', 
                  backgroundColor: 'rgba(39, 45, 79, 0.85)',
                  borderRadius: '16px',
                  border: '1px solid var(--marian-blue)',
                  padding: '0.5rem 1rem',
                  alignItems: 'center',
                  margin: '0 1.5rem'
                }}>
                  {/* Attachment Icon */}
                  <AttachFileIcon 
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.5)', 
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '1.2rem'
                    }} 
                  />
                  
                  {/* Input Field */}
                  <input
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'white',
                      fontSize: '1rem',
                      padding: '0.5rem'
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && input.trim()) {
                        handleSend(input);
                      }
                    }}
                  />
                  
                  {/* Send Icon - Changes color based on input */}
                  <SendIcon 
                    onClick={() => handleSend(input)}
                    style={{ 
                      color: input.trim() ? 'var(--orange-crayola)' : 'rgba(255, 255, 255, 0.4)', 
                      cursor: input.trim() ? 'pointer' : 'default',
                      fontSize: '1.2rem',
                      transition: 'color 0.2s'
                    }} 
                  />
                </div>
              </Box>
            </Box>
          ) : (
            <Box className="chat-main">
              <Box className="chat-main-input-centered">
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'var(--orange-crayola)', fontWeight: 600, fontSize: '1.5rem' }}>
                    <p> What can {selectedAssistant ? selectedAssistant.name : 'the assistant'} help you with?</p> 
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    backgroundColor: 'rgba(39, 45, 79, 0.85)',
                    borderRadius: '16px',
                    border: '1px solid var(--marian-blue)',
                    padding: '0.5rem 1rem',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '500px'
                  }}>
                    <input
                      style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                        fontSize: '1rem',
                        padding: '0.5rem'
                      }}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && input.trim()) {
                          // Start a new chat when no chat is selected
                          // No dummyHistory, so just setSelected(0) for now
                          setSelected(0);
                          handleSend(input);
                        }
                      }}
                    />
                    
                    <SendIcon 
                      onClick={() => {
                        if (input.trim()) {
                          setSelected(0);
                          handleSend(input);
                        }
                      }}
                      style={{ 
                        color: input.trim() ? 'var(--orange-crayola)' : 'rgba(255, 255, 255, 0.4)', 
                        cursor: input.trim() ? 'pointer' : 'default',
                        fontSize: '1.2rem',
                        transition: 'color 0.2s'
                      }} 
                    />
                  </div>
                </div>
              </Box>
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default Chat;