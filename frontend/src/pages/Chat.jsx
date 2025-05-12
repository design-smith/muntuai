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

// Dummy history data with additional fields for ChatScope
const dummyHistory = [
  { 
    id: 0,
    sender: 'AI Assistant',
    message: 'How can I help you today?', 
    time: '09:00',
    assistantName: 'Rose',
    assistantType: 'Sales assistant' 
  },
  { 
    id: 1,
    sender: 'You', 
    message: 'Show me my schedule.', 
    time: '09:01',
    assistantName: 'Rose',
    assistantType: 'Sales assistant'
  },
  { 
    id: 2,
    sender: 'AI Assistant', 
    message: 'Here is your schedule for today...', 
    time: '09:01',
    assistantName: 'Alex',
    assistantType: 'General assistant'
  },
  { 
    id: 3,
    sender: 'You', 
    message: 'Remind me to call John at 2pm.', 
    time: '09:02',
    assistantName: 'Mia',
    assistantType: 'Customer support'
  },
  { 
    id: 4,
    sender: 'AI Assistant', 
    message: 'Reminder set for 2pm to call John.', 
    time: '09:02',
    assistantName: 'Mia',
    assistantType: 'Customer support'
  },
];

// Available AI assistants
const assistants = [
  { name: 'Rose', desc: 'Sales assistant', color: '#FF7125' },
  { name: 'Alex', desc: 'General assistant', color: '#3C4884' },
  { name: 'Mia', desc: 'Customer support', color: '#21a300' },
];

// Initial messages per conversation
const initialMessagesPerChat = [
  [
    { sender: 'AI Assistant', text: 'How can I help you today?', position: 'incoming', time: '09:00' },
    { sender: 'You', text: 'Show me my schedule.', position: 'outgoing', time: '09:01' },
    { sender: 'AI Assistant', text: 'Here is your schedule for today...', position: 'incoming', time: '09:01' },
  ],
  [
    { sender: 'You', text: 'Remind me to call John at 2pm.', position: 'outgoing', time: '09:02' },
    { sender: 'AI Assistant', text: 'Reminder set for 2pm to call John.', position: 'incoming', time: '09:02' },
  ],
  [],
  [],
  [],
];

const Chat = () => {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [messagesPerChat, setMessagesPerChat] = useState(initialMessagesPerChat);
  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const messagesEndRef = useRef(null);

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
  React.useEffect(() => {
    if (selected !== null && messagesPerChat[selected]) {
      setCurrentMessages(messagesPerChat[selected]);
    } else {
      setCurrentMessages([]);
    }
  }, [selected, messagesPerChat]);

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

    // Clear input
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const assistantMessage = {
        sender: `${selectedAssistant.name} (AI)`,
        text: getAssistantResponse(content, selectedAssistant.name),
        position: 'incoming',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Update messages for this chat
      setMessagesPerChat(prev => {
        const updated = [...prev];
        updated[selected] = [...(updated[selected] || []), assistantMessage];
        return updated;
      });

      // Update current messages
      setCurrentMessages(prev => [...prev, assistantMessage]);
    }, 800);
  };

  // Simple AI response generator based on assistant type
  const getAssistantResponse = (message, assistantName) => {
    const assistant = assistants.find(a => a.name === assistantName);
    
    if (assistant.name === 'Rose') {
      return `As your sales assistant, I can help with that! ${message.includes('schedule') ? 'I found your sales meetings for today.' : 'Is there anything specific about our products you would like to know?'}`;
    } else if (assistant.name === 'Alex') {
      return `I'm here to assist with general inquiries. ${message.includes('schedule') ? 'Here is your schedule for today.' : 'How else can I help you?'}`;
    } else if (assistant.name === 'Mia') {
      return `As your customer support assistant, ${message.includes('schedule') ? 'I can see your customer meetings for today.' : 'I can help troubleshoot any issues you are experiencing.'}`;
    }
    
    return "I can help with scheduling, reminders, and more!";
  };

  // Handle assistant selection from dropdown
  const handleAssistantSelect = (assistant) => {
    setSelectedAssistant(assistant);
    setDropdownOpen(false);
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
              {selectedAssistant.name}
            </div>
            {dropdownOpen && (
              <div className="assistant-dropdown">
                {assistants.map((a) => (
                  <div
                    key={a.name}
                    className="assistant-dropdown-option"
                    onClick={() => handleAssistantSelect(a)}
                  >
                    <div className="assistant-dropdown-name">{a.name}</div>
                    <div className="assistant-dropdown-desc">{a.desc}</div>
                  </div>
                ))}
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
              {dummyHistory.map((conv, idx) => (
                <Box
                  key={idx}
                  className={`conversation-list-item chat-history-item${selected === idx ? ' selected' : ''}`}
                  onClick={() => setSelected(idx)}
                >
                  <div className="chat-history-sender">{conv.sender}</div>
                  <div className="chat-history-message">{conv.message}</div>
                  <div className="chat-history-time">{conv.time}</div>
                </Box>
              ))}
            </Box>
        </Box>

        {/* Main chat area */}
          {selected !== null ? (
            <Box className="chat-main">
              {/* Messages area */}
              <Box className="chat-main-messages">
                {currentMessages.map((msg, idx) => (
                  <Box key={idx} className={`message-bubble-wrapper-${msg.position === 'outgoing' ? 'right' : 'left'}`}>
                    <Box className={`message-bubble-${msg.position === 'outgoing' ? 'right' : 'left'}`}>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>
                        {msg.sender} • {msg.time}
                      </div>
                      {msg.text}
                    </Box>
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
                    <p> What can {selectedAssistant.name} help you with?</p> 
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
                          const newChatIndex = dummyHistory.length;
                          setSelected(newChatIndex);
                          handleSend(input);
                        }
                      }}
                    />
                    
                    <SendIcon 
                      onClick={() => {
                        if (input.trim()) {
                          // Start a new chat when no chat is selected
                          const newChatIndex = dummyHistory.length;
                          setSelected(newChatIndex);
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