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
import { useUser } from '../App';
import { useNavigate } from 'react-router-dom';

function formatMessageTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // e.g., Tue 2:37 PM
    return date.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  }
}

const Chat = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [messagesPerChat, setMessagesPerChat] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [assistantsLoading, setAssistantsLoading] = useState(false);
  const [assistantsError, setAssistantsError] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loadingChats, setLoadingChats] = useState(false);

  // Fetch assistants on mount
  useEffect(() => {
    if (!user?.accessToken) return;
    setAssistantsLoading(true);
    setAssistantsError('');
    fetch('http://localhost:8000/assistants', {
      headers: { 'Authorization': `Bearer ${user.accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        setAssistants(data.assistants || []);
        if (data.assistants && data.assistants.length > 0 && !selectedAssistant) {
          setSelectedAssistant(data.assistants[0]);
        }
      })
      .catch(() => setAssistantsError('Failed to load assistants'))
      .finally(() => setAssistantsLoading(false));
  }, [user]);

  // Fetch chat list on mount and when user changes
  useEffect(() => {
    if (!user?.accessToken) return;
    setLoadingChats(true);
    fetch(`http://localhost:8000/api/chats?user_id=${user.id}`, {
      headers: { 'Authorization': `Bearer ${user.accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        // Sort chats by updated_at or created_at descending
        const sortedChats = (data.chats || []).sort((a, b) => {
          const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
          const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
          return bTime - aTime;
        });
        setChatList(sortedChats);
        setMessagesPerChat(sortedChats.map(c => {
          const assistant = assistants.find(a => a._id === c.assistant_id);
          return (c.messages || []).map(m => {
            // Determine if this is an assistant or user message
            const isAssistant = assistant && m.sender === assistant.name;
            return {
              sender: m.sender,
              text: m.text,
              position: isAssistant ? 'incoming' : 'outgoing',
              time: m.created_at || '',
            };
          });
        }));
      })
      .finally(() => setLoadingChats(false));
  }, [user, assistants]);

  // Connect to WebSocket for selected chat
  useEffect(() => {
    if (selected === null || !chatList[selected]?._id) return;
    websocketService.connectToChat(chatList[selected]._id);
    const handleMessage = (data) => {
      if (data.type === 'message') {
        const newMessage = {
          sender: data.sender,
          text: data.content,
          position: 'incoming',
          time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    // Set current messages
    setCurrentMessages(messagesPerChat[selected] || []);
    return () => {
      websocketService.removeMessageHandler(handleMessage);
      websocketService.disconnect();
    };
  }, [selected, chatList]);

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

  // Handle sending a message
  const handleSend = async (content) => {
    if (!content.trim()) return;
    // If no chat selected, create a new chat
    if (selected === null) {
      if (!selectedAssistant || !user?.id) return;
      // Create chat
      const res = await fetch('http://localhost:8000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          user_id: user.id,
          assistant_id: selectedAssistant._id,
          messages: []
        })
      });
      const chat = await res.json();
      // Optimistically add the message to the new chat
      const userMessage = {
        sender: 'You',
        text: content,
        position: 'outgoing',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      // Insert new chat at the top
      setChatList(prev => [chat, ...prev]);
      setMessagesPerChat(prev => [[userMessage], ...prev]);
      setSelected(0); // new chat is now at the top
      setTimeout(() => {
        websocketService.connectToChat(chat._id);
        websocketService.sendMessage(content);
      }, 200);
      setInput('');
      setCurrentMessages([userMessage]);
      return;
    }
    // User message
    const userMessage = {
      sender: 'You',
      text: content,
      position: 'outgoing',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessagesPerChat(prev => {
      const updated = [...prev];
      updated[selected] = [...(updated[selected] || []), userMessage];
      return updated;
    });
    setCurrentMessages(prev => [...prev, userMessage]);
    websocketService.sendMessage(content);
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
              {selectedAssistant ? `${selectedAssistant.name} (${selectedAssistant.type || 'General'})` : 'Select Assistant'}
            </div>
            {dropdownOpen && (
              <div className="assistant-dropdown">
                {assistantsLoading ? (
                  <div className="assistant-dropdown-option">Loading...</div>
                ) : assistantsError ? (
                  <div className="assistant-dropdown-option" style={{ color: 'red' }}>{assistantsError}</div>
                ) : assistants.length === 0 ? (
                  <div className="assistant-dropdown-option">No assistants found</div>
                ) : assistants.map((a) => (
                  <div
                    key={a._id}
                    className="assistant-dropdown-option"
                    onClick={() => { setSelectedAssistant(a); setDropdownOpen(false); }}
                  >
                    <span className="assistant-dropdown-name">{a.name}</span>
                    <span className="assistant-dropdown-desc">{a.type || 'General'}</span>
                  </div>
                ))}
                <div className="assistant-dropdown-add"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings?section=assistants&addAssistant=1');
                  }}
                >
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
            {loadingChats ? (
              <div style={{ color: '#fff', opacity: 0.7, padding: '1rem' }}>Loading chats...</div>
            ) : chatList.length === 0 ? (
              <div style={{ color: '#fff', opacity: 0.7, padding: '1rem' }}>No chats yet</div>
            ) : chatList.map((chat, idx) => {
              const lastMsg = (chat.messages && chat.messages.length > 0) ? chat.messages[chat.messages.length - 1] : null;
              const assistant = assistants.find(a => a._id === chat.assistant_id);
              return (
                <div
                  key={chat._id}
                  className={`chat-history-item${selected === idx ? ' selected' : ''}`}
                  onClick={() => setSelected(idx)}
                >
                  <div className="chat-history-sender">{assistant ? assistant.name : 'Assistant'}</div>
                  <div className="chat-history-message">{lastMsg ? (lastMsg.content || lastMsg.text) : 'No messages yet'}</div>
                  <div className="chat-history-time">{lastMsg ? formatMessageTime(lastMsg.time || lastMsg.created_at || '') : ''}</div>
                </div>
              );
            })}
          </Box>
        </Box>
        {/* Main chat area */}
        {selected !== null ? (
          <Box className="chat-main">
            {/* Messages area */}
            <Box className="chat-main-messages">
              {currentMessages.map((msg, idx) => (
                <Box key={idx}>
                  <Box className={`message-bubble-wrapper-${msg.position === 'outgoing' ? 'right' : 'left'}`}> 
                    <Box className={`message-bubble-${msg.position === 'outgoing' ? 'right' : 'left'}`}>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>
                        {msg.sender} • {formatMessageTime(msg.time)}
                      </div>
                      {msg.text}
                    </Box>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            {/* Input area */}
            <Box className="chat-main-input">
              <div style={{ 
                display: 'flex', 
                backgroundColor: '#202020',
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
                      console.log("Sending message:", input);
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
                  backgroundColor: '#202020',
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
                        handleSend(input);
                      }
                    }}
                  />
                  <SendIcon 
                    onClick={() => {
                      if (input.trim()) {
                        handleSend(input);
                        console.log("Sending message:", input);
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