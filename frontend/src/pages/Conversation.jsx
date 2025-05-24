import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Chip, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Search from '../components/Search';
import { Button as MuiButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReactDOM from 'react-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import CfeedBubble from '../components/CfeedBubble';

// Source types with icons
const sourceConfig = {
  'Email': { icon: <EmailIcon fontSize="small" />, color: 'transparent' },
  'SMS': { icon: <SmsIcon fontSize="small" />, color: 'transparent' },
  'Phone': { icon: <PhoneIcon fontSize="small" />, color: 'transparent' },
  'WhatsApp': { icon: <WhatsAppIcon fontSize="small" />, color: 'transparent' },
  'Slack': { icon: <ChatBubbleOutlineIcon fontSize="small" />, color: 'transparent' }
};

const allSources = Object.keys(sourceConfig);

// Dummy conversations data
const conversationsData = [
  { sender: 'Alice Brown', message: 'Thanks for your help. Looking forward to it.', time: 'Today, 2:13 PM', unread: 0, source: 'Email' },
  { sender: 'David Kim', message: 'Hey, are you available for a call?', time: 'Today, 1:05 PM', unread: 3, source: 'Phone' },
  { sender: 'Support Bot', message: 'Reminder: Follow up with new leads.', time: '09:30', unread: 1, source: 'Slack' },
  { sender: 'Maria Garcia', message: 'Can you send the report?', time: 'Yesterday, 4:45 PM', unread: 0, source: 'Email' },
  { sender: 'John Smith', message: 'Let me know when you are free.', time: 'Yesterday, 3:20 PM', unread: 2, source: 'SMS' },
  { sender: 'Emma Wilson', message: 'Received your email, thanks!', time: 'Yesterday, 11:10 AM', unread: 0, source: 'WhatsApp' },
  { sender: 'Olivia Lee', message: 'Meeting rescheduled to Friday.', time: 'Monday, 9:00 AM', unread: 1, source: 'Email' },
  { sender: 'Liam Johnson', message: 'Please review the document.', time: 'Monday, 8:30 AM', unread: 0, source: 'Slack' },
  { sender: 'Noah Martinez', message: 'Happy to connect!', time: 'Sunday, 7:15 PM', unread: 0, source: 'Phone' },
  { sender: 'Sophia Davis', message: 'Let\'s catch up soon.', time: 'Sunday, 6:00 PM', unread: 1, source: 'WhatsApp' },
  { sender: 'Mason Clark', message: 'Sent the files you requested.', time: 'Sunday, 2:45 PM', unread: 0, source: 'Email' },
  { sender: 'Isabella Lewis', message: 'Thank you for your support.', time: 'Saturday, 5:30 PM', unread: 0, source: 'SMS' },
];

// Sample message data per conversation
const messagesByConversation = {
  'Alice Brown': [
    { sender: 'Alice Brown', text: "Hi, I'm interested in your services.", position: 'incoming', time: '2:13 PM' },
    { sender: 'You', text: "Thanks! I'll get back to you shortly.", position: 'outgoing', time: '2:14 PM' },
    {
      sender: 'You',
      type: 'cfeed',
      cfeedType: 'action',
      position: 'outgoing',
      time: '2:15 PM',
      content: {
        eventTitle: 'Demo Meeting',
        date: '06/15/2025',
        time: '10:00',
        description: 'Product demo for Alice Brown',
        guests: 'Alice Brown',
      },
      status: 'pending',
    },
    {
      sender: 'You',
      type: 'cfeed',
      cfeedType: 'messaging',
      position: 'outgoing',
      time: '2:16 PM',
      content: {
        text: 'Hi Alice, just confirming our meeting for tomorrow at 10am. Let me know if that works!'
      },
      status: 'pending',
    },
  ],
  'David Kim': [
    { sender: 'David Kim', text: "Hey, are you available for a call?", position: 'incoming', time: '1:05 PM' },
    { sender: 'You', text: "I'm in a meeting right now. Can I call you in an hour?", position: 'outgoing', time: '1:10 PM' },
    { sender: 'David Kim', text: "Sure, that works for me.", position: 'incoming', time: '1:11 PM' },
    { sender: 'David Kim', text: "Also, I wanted to discuss the project timeline.", position: 'incoming', time: '1:12 PM' },
    { sender: 'David Kim', text: "Let me know what you think of the proposal.", position: 'incoming', time: '1:15 PM' },
  ]
};

// Initialize message data for all conversations
conversationsData.forEach(conv => {
  if (!messagesByConversation[conv.sender]) {
    messagesByConversation[conv.sender] = [
      { sender: conv.sender, text: conv.message, position: 'incoming', time: conv.time },
    ];
  }
});

// Dummy contact info for demonstration
const contactInfo = {
  Email: 'alice.brown@email.com',
  SMS: '+1 555-123-4567',
  Phone: '+1 555-123-4567',
  WhatsApp: '+1 555-987-6543',
  Slack: '@alicebrown',
};

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedSources, setSelectedSources] = useState(allSources);
  const [sourceSearch, setSourceSearch] = useState('');
  const [search, setSearch] = useState('');
  const [showContactSlider, setShowContactSlider] = useState(false);
  const [addingChannel, setAddingChannel] = useState(false);
  const [newChannelType, setNewChannelType] = useState('Email');
  const [newChannelValue, setNewChannelValue] = useState('');
  const [contextSummary, setContextSummary] = useState('This is a summary of the conversation. You can edit this as needed.');
  const [leadTempOn, setLeadTempOn] = useState(false);
  const [leadTempValue, setLeadTempValue] = useState(98);
  const [conversationsData, setConversationsData] = useState([]);

  // Static upcoming events data
  const upcomingEvents = [
    {
      title: 'Follow-up Call',
      date: 'May 11, 2025, 04:35 PM',
      details: '',
    },
    {
      title: 'Product Demo',
      date: 'May 14, 2025, 04:35 PM',
      details: '',
    },
  ];

  // Fetch conversations from backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:8000/conversations');
        const data = await response.json();
        setConversationsData(data.conversations || []);
      } catch {
        setConversationsData([]);
      }
    };
    fetchConversations();
  }, []);

  // Filter conversations based on selected sources and search
  const filteredConversations = conversationsData.filter(c =>
    selectedSources.includes(c.source) &&
    ((c.sender && c.sender.toLowerCase().includes(search.toLowerCase())) || 
     (c.message && c.message.toLowerCase().includes(search.toLowerCase())))
  );

  // Handle source filter changes
  const handleSourceChange = (event) => {
    const value = event.target.value;
    setSelectedSources(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteSource = (sourceToDelete) => {
    setSelectedSources(selectedSources.filter(s => s !== sourceToDelete));
  };

  const allSelected = selectedSources.length === allSources.length;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSources(allSources);
    } else {
      setSelectedSources([]);
    }
  };

  const filteredSources = allSources.filter(src => 
    src.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  // Handle message sending
  const handleSend = () => {
    if (!selectedConversation || !input.trim()) return;

    const newMessage = {
      sender: 'You',
      text: input,
      position: 'outgoing',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages state
    setMessages([...messages, newMessage]);

    // Update conversation messages
    if (messagesByConversation[selectedConversation.sender]) {
      messagesByConversation[selectedConversation.sender].push(newMessage);
    }

    // Clear input
    setInput('');
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(messagesByConversation[conversation.sender] || []);
  };

  const handleContactNameClick = () => {
    setShowContactSlider(true);
  };

  const handleCloseSlider = () => {
    setShowContactSlider(false);
  };

  // Handler for cfeed actions
  const handleCfeedApprove = (msgIdx) => {
    setMessages(() => {
      const chatMsgs = [...messages];
      const cfeedMsg = chatMsgs[msgIdx];
      if (cfeedMsg && cfeedMsg.type === 'cfeed') {
        // Add as normal outgoing message
        chatMsgs.splice(msgIdx, 1, {
          sender: 'You',
          text: cfeedMsg.cfeedType === 'messaging' ? cfeedMsg.content.text :
            `Event: ${cfeedMsg.content.eventTitle}\nDate: ${cfeedMsg.content.date} ${cfeedMsg.content.time}\nDescription: ${cfeedMsg.content.description}\nGuests: ${cfeedMsg.content.guests}`,
          position: 'outgoing',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
        });
      }
      return chatMsgs;
    });
    setEditingCfeedIdx(null);
  };

  const handleCfeedEdit = (msgIdx) => {
    setEditingCfeedIdx(msgIdx);
  };

  const handleCfeedDecline = (msgIdx) => {
    setMessages(() => {
      const chatMsgs = [...messages];
      chatMsgs.splice(msgIdx, 1);
      return chatMsgs;
    });
    setEditingCfeedIdx(null);
  };

  const handleCfeedSaveEdit = (msgIdx, newContent) => {
    setMessages(() => {
      const chatMsgs = [...messages];
      // Send as outgoing message and remove cfeed
      chatMsgs.splice(msgIdx, 1, {
        sender: 'You',
        text: newContent.text ||
          `Event: ${newContent.eventTitle}\nDate: ${newContent.date} ${newContent.time}\nDescription: ${newContent.description}\nGuests: ${newContent.guests}`,
        position: 'outgoing',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      });
      return chatMsgs;
    });
    setEditingCfeedIdx(null);
  };

  const handleCfeedCancelEdit = () => {
    setEditingCfeedIdx(null);
  };

  return (
    <>
      <div className="page-container">
        
          {showContactSlider && ReactDOM.createPortal(
            <div className="contact-slider-overlay" onClick={handleCloseSlider}>
              <div className="contact-slider-panel" onClick={e => e.stopPropagation()}>
                <div className="contact-slider-header">
                  <span className="contact-slider-close" onClick={handleCloseSlider}>&times;</span>
                </div>
                <div className="contact-slider-content">
                  <div className="contact-slider-name">{selectedConversation?.sender}</div>
                  <div className="section" style={{ margin: 0, marginTop: '1.5rem', background: 'rgba(39, 45, 79, 0.7)', boxShadow: 'none', border: 'none' }}>
                    <div style={{ fontWeight: 600, color: 'var(--orange-crayola)', marginBottom: '1rem', fontSize: '1.1rem' }}>Contact Channels</div>
                    {selectedConversation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', color: 'var(--bone)' }}>
                          {sourceConfig[selectedConversation.source].icon}
                        </span>
                        <span style={{ color: 'var(--bone)', fontSize: '1rem', fontWeight: 500 }}>
                          {contactInfo[selectedConversation.source]}
                        </span>
                      </div>
                    )}
                    {/* Add Channel Button and Form */}
                    {!addingChannel ? (
                      <button className="add-channel-btn" onClick={() => setAddingChannel(true)}>
                        Add Channel
                      </button>
                    ) : (
                      <div className="add-channel-form">
                        <select
                          className="add-channel-dropdown"
                          value={newChannelType}
                          onChange={e => setNewChannelType(e.target.value)}
                        >
                          {Object.keys(sourceConfig).map((ch) => (
                            <option key={ch} value={ch}>{ch}</option>
                          ))}
                        </select>
                        <input
                          className="add-channel-input"
                          type="text"
                          placeholder={`Enter ${newChannelType}...`}
                          value={newChannelValue}
                          onChange={e => setNewChannelValue(e.target.value)}
                        />
                        <button className="add-channel-save-btn" onClick={() => setAddingChannel(false)}>
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Context Summary Section */}
                  <div className="section" style={{ margin: 0, marginTop: '1.5rem', background: 'rgba(39, 45, 79, 0.7)', boxShadow: 'none', border: 'none' }}>
                    <div style={{ fontWeight: 600, color: 'var(--orange-crayola)', marginBottom: '1rem', fontSize: '1.1rem' }}>Context Summary</div>
                    <textarea
                      className="context-summary-textarea"
                      value={contextSummary}
                      onChange={e => setContextSummary(e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        background: 'rgba(39, 45, 79, 0.85)',
                        color: 'var(--bone)',
                        border: '1.5px solid var(--marian-blue)',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        fontFamily: 'Work Sans, sans-serif',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                  {/* Upcoming Events Section */}
                  <div className="section upcoming-events-section">
                    <div className="upcoming-events-title">Upcoming Events</div>
                    <div className="upcoming-events-list">
                      {upcomingEvents.map((event, idx) => (
                        <div className="upcoming-event-row" key={idx}>
                          <div className="upcoming-event-title">{event.title}</div>
                          <div className="upcoming-event-details">
                            <CalendarMonthIcon className="upcoming-event-icon" fontSize="small" />
                            <span className="upcoming-event-date">{event.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="upcoming-events-schedule-btn-row">
                      <Button variant="text" className="upcoming-events-schedule-btn">
                        <CalendarMonthIcon className="upcoming-event-icon" fontSize="small" style={{ marginRight: 6 }} />
                        Schedule Event
                      </Button>
                    </div>
                  </div>
                  {/* Lead Temperature Section */}
                  <div className="section lead-temp-section">
                    <div className="lead-temp-header">
                      <span className="lead-temp-title">
                        <ThermostatIcon className="lead-temp-icon" fontSize="small" />
                        Lead Temperature
                      </span>
                      <span className="lead-temp-toggle-row">
                        <span className="lead-temp-toggle-label">This is a lead</span>
                        <Switch
                          checked={leadTempOn}
                          onChange={e => setLeadTempOn(e.target.checked)}
                          className="lead-temp-switch"
                          size="small"
                        />
                      </span>
                    </div>
                    {!leadTempOn && (
                      <div className="lead-temp-off-desc">
                        Toggle "This is a lead" to analyze conversion potential.
                      </div>
                    )}
                    {leadTempOn && (
                      <>
                        <div className="lead-temp-bar-row">
                          <div className="lead-temp-bar-bg" style={{ position: 'relative' }}>
                            <div
                              className="lead-temp-pointer"
                              style={{ left: `calc(${leadTempValue}% - 10px)` }}
                            >
                              <div className="lead-temp-pointer-arrow" />
                              <div className="lead-temp-pointer-label">{leadTempValue}%</div>
                            </div>
                            <Slider
                              className="lead-temp-slider"
                              value={leadTempValue}
                              min={0}
                              max={100}
                              step={1}
                              onChange={(_, v) => setLeadTempValue(v)}
                              aria-label="Lead Temperature"
                            />
                          </div>
                        </div>
                        <div className="lead-temp-likelihood">
                          This lead is <span className="lead-temp-likelihood-link">{leadTempValue}% likely</span> to convert based on AI analysis.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
          <Box className="page-container">
            <Box className="conversations-window">
              {/* Top Section with buttons */}
              <Box className="conversation-topbar">
                  <Box className="conversation-topbar-title">
                      <h3>Conversations</h3>
                  </Box>
                <div /> 
                <Box style={{ display: 'flex', gap: '1rem' }} className="conversation-topbar-buttons">
                  <MuiButton
                    className="button button-outlined"
                    variant="outlined"
                  >
                    Lead Recovery
                  </MuiButton>
                  <MuiButton
                    className="button button-contained"
                    variant="contained"
                  >
                    New Message
                  </MuiButton>
                </Box>
              </Box>

              {/* Main Chat Interface */}
              <Box className="conversation-bottom">
                {/* Left side: Conversations list */}
                <Box className="conversation-list" style={{ height: '100%', overflow: 'hidden' }}>
                  {/* Source Filter */}
                  <Box className="conversation-list-grid">
                    <FormControl size="small" className="conversation-source-select">
                      <InputLabel id="source-filter-label">Source</InputLabel>
                      <Select
                        labelId="source-filter-label"
                        multiple
                        value={selectedSources}
                        onChange={handleSourceChange}
                        input={<OutlinedInput label="Source"/>}
                        renderValue={(selected) => {
                          const chipsToShow = selected.slice(0, 3);
                          const extraCount = selected.length - 3;
                          return (
                            <Box className="source-chips">
                              {chipsToShow.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  size="small"
                                  onDelete={() => handleDeleteSource(value)}
                                  deleteIcon={<CloseIcon />}
                                  style={{ marginRight: 4 }}
                                />
                              ))}
                              {extraCount > 0 && (
                                <span className="conversation-source-count-badge">+{extraCount}</span>
                              )}
                            </Box>
                          );
                        }}
                        MenuProps={{
                          PaperProps: { className: 'conversation-source-select' },
                          MenuListProps: { style: { paddingTop: 0, paddingBottom: 0 } },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1, pb: 0 }}>
                          <Checkbox
                            size="small"
                            checked={allSelected}
                            indeterminate={selectedSources.length > 0 && !allSelected}
                            onChange={handleSelectAll}
                            style={{ padding: 0, marginRight: 8 }}
                          />
                          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Select All</span>
                        </Box>
                        <Box className="source-search">
                          <SearchIcon />
                          <input
                            className="conversation-source-search"
                            placeholder="Search"
                            value={sourceSearch}
                            onChange={e => setSourceSearch(e.target.value)}
                          />
                        </Box>
                        {filteredSources.map((source) => (
                          <MenuItem key={source} value={source}>
                            <Checkbox checked={selectedSources.indexOf(source) > -1} />
                            <ListItemText primary={source} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Search Bar */}
                      <Search
                        className="dashboard-search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search conversations..."
                      />

                    {/* Conversation List */}
                    <Box className="messaging-list conversation-list-items">
                      {filteredConversations.map((conv, index) => (
                        <React.Fragment key={index}>
                          <Box 
                            onClick={() => handleConversationSelect(conv)} 
                            className={`conversation-list-item${selectedConversation?.sender === conv.sender ? ' selected' : ''}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
                              <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                backgroundColor: sourceConfig[conv.source].color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginRight: '12px'
                              }}>
                                {sourceConfig[conv.source].icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div style={{ fontWeight: 600, color: '#fff' }}>{conv.sender}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{conv.time}</div>
                                </div>
                                <div style={{ 
                                  color: '#b0b0b0', 
                                  fontSize: '0.8rem', 
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {conv.message}
                                </div>
                              </div>
                              {conv.unread > 0 && (
                                <div style={{
                                  backgroundColor: 'var(--orange-crayola)',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  marginLeft: '8px'
                                }}>
                                  {conv.unread}
                                </div>
                              )}
                            </div>
                          </Box>
                          {index < filteredConversations.length - 1 && <Divider className="conversation-divider" />}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Right side: Chat Window */}
                <Box className="conversation-chat-window">
                  {selectedConversation ? (
                    <Box className="conversation-chat-content">
                      {/* Conversation Header */}
                      <Box style={{ 
                        padding: '1rem 2rem', 
                        fontWeight: 700, 
                        fontSize: '1.2rem', 
                        color: 'var(--orange-crayola)',
                        borderBottom: '1px solid var(--marian-blue)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span
                            className="conversation-contact-name"
                            onClick={handleContactNameClick}
                            tabIndex={0}
                            style={{ cursor: 'pointer', borderRadius: '8px', padding: '2px 8px', transition: 'background 0.15s' }}
                          >
                            {selectedConversation.sender}
                          </span>
                           <span className={`source-badge source-${selectedConversation.source.toLowerCase()}`} style={{
                             backgroundColor: sourceConfig[selectedConversation.source].color,
                             display: 'inline-flex',
                             alignItems: 'center',
                             padding: '0.15em 0.7em',
                             borderRadius: '999px',
                             fontSize: '0.75rem',
                             marginLeft: '12px',
                             color: 'white'
                           }}>
                             {sourceConfig[selectedConversation.source].icon} 
                             <span style={{ marginLeft: '4px' }}>{selectedConversation.source}</span>
                           </span>
                        </div>
                      </Box>
                      
                      {/* Messages */}
                      <Box className="conversation-messages">
                        {messages.map((msg, idx) => (
                          <Box key={idx}>
                            {msg.type === 'cfeed' ? (
                              <CfeedBubble
                                cfeedType={msg.cfeedType}
                                content={msg.content}
                                position={msg.position === 'outgoing' ? 'right' : 'left'}
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
                      </Box>
                      
                      {/* Input */}
                      <Box className="conversation-input">
                        <div style={{ 
                          display: 'flex', 
                          backgroundColor: 'rgba(39, 45, 79, 0.85)',
                          borderRadius: '16px',
                          border: '1px solid var(--marian-blue)',
                          padding: '0.5rem 1rem',
                          alignItems: 'center'
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
                                handleSend();
                              }
                            }}
                          />
                          
                          {/* Send Icon - Changes color based on input */}
                          <SendIcon 
                            onClick={handleSend}
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
                    <Button 
                      className="button button-contained conversation-start-btn" 
                      variant="contained" 
                    >
                      Start Conversation
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
    </>
  );
};

export default Conversations;