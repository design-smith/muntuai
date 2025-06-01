import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import { LineChartDisplay, DonutChartDisplay } from '../components/ChartsSection';
import { InfoCard } from '../components/CardElements';
import { UnopenedMessage } from '../components/MessagingElements';
import { TodoCard } from '../components/BasicFormElements';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Search from '../components/Search';
import ChartsSection from '../components/ChartsSection';
import { useUser } from '../App';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [topMessages, setTopMessages] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [cards, setCards] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeframe, setTimeframe] = useState('Month');
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [metrics, setMetrics] = useState({
    conversationsToday: 0,
    messagesToday: 0,
    contacts: 0,
    businesses: 0,
  });
  const { user, supabase, setUser } = useUser();
  const navigate = useNavigate();

  const handleToggleTodo = () => {
    // No-op if no data
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleTimeframe = (event, newTimeframe) => {
    if (newTimeframe) setTimeframe(newTimeframe);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  // Helper to get ISO string for start of today
  const getTodayISOString = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // 1. Fetch user doc from DB with auth token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) {
          console.error('No access token available');
          return;
        }

        const userRes = await fetch(`http://localhost:8000/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userRes.ok) {
          throw new Error(`HTTP error! status: ${userRes.status}`);
        }

        const userData = await userRes.json();
        console.log('Fetched user data:', userData);
        setUserDoc(userData);

        // 2. Fetch metrics
        const today = getTodayISOString();
        // Conversations today
        const convRes = await fetch(`/api/conversations`);
        const convData = await convRes.json();
        const conversationsToday = convData.conversations.filter(
          c => c.user_id === user.id && c.created_at && new Date(c.created_at) >= new Date(today)
        );
        // Messages today
        const msgRes = await fetch(`/api/messages`);
        const msgData = await msgRes.json();
        const messagesToday = msgData.messages.filter(
          m => m.user_id === user.id && m.created_at && new Date(m.created_at) >= new Date(today)
        );
        // Contacts
        const contactsRes = await fetch(`/api/contacts`);
        const contactsData = await contactsRes.json();
        const contacts = contactsData.contacts.filter(c => c.user_id === user.id);
        // Businesses
        const bizRes = await fetch(`/api/businesses`);
        const bizData = await bizRes.json();
        const businesses = bizData.businesses.filter(b => b.user_id === user.id);

        setMetrics({
          conversationsToday: conversationsToday.length,
          messagesToday: messagesToday.length,
          contacts: contacts.length,
          businesses: businesses.length,
        });
        // For Action Required (topMessages)
        setTopMessages(messagesToday.slice(0, 3));
        // For To-Do Today (todoItems)
        setTodoItems([]); // No real to-do data, so empty
        // For Channel Volume (charts)
        setChannelData([]); // No real channel data, so empty
        setLineData([]); // No real line data, so empty
        // For Cards (metrics)
        setCards([
          {
            title: 'Conversations Today',
            value: conversationsToday.length,
            icon: <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: 'var(--marian-blue)' }} />,
            change: '',
            changeColor: '',
            subtext: '',
          },
          {
            title: 'Messages Today',
            value: messagesToday.length,
            icon: <TrendingUpIcon sx={{ fontSize: 28, color: 'var(--desert-sand)' }} />,
            change: '',
            changeColor: '',
            subtext: '',
          },
          {
            title: 'Contacts',
            value: contacts.length,
            icon: <ReplayIcon sx={{ fontSize: 28, color: 'var(--orange-crayola)' }} />,
            change: '',
            changeColor: '',
            subtext: '',
          },
          {
            title: 'Businesses',
            value: businesses.length,
            icon: <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: 'var(--orange-crayola)' }} />,
            change: '',
            changeColor: '',
            subtext: '',
          },
        ]);
      } catch {
        setTopMessages([]);
        setTodoItems([]);
        setChannelData([]);
        setLineData([]);
        setCards([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id, timeframe]);

  return (
    <Box className="page-container">
      <Box className="dashboard-topbar">
        <h1>
          Welcome {userDoc?.first_name || userDoc?.name?.split(' ')[0] || 'User'}
        </h1>
        <Box className="dashboard-topbar-actions">
          <Search />
          <IconButton size="large" className="dashboard-profile-icon" onClick={handleProfileMenuOpen}>
            <AccountCircle fontSize="large" />
          </IconButton>
          <span className="dashboard-username">{userDoc?.first_name || userDoc?.name?.split(' ')[0] || 'User'}</span>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            className="dashboard-profile-menu"
          >
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box className="section">
        <div className="dashboard-sections-row">
          <div className="dashboard-section">
            <h3>Action Required</h3>
            {loading ? (
              <div>Loading...</div>
            ) : topMessages.length === 0 ? (
              <div>No data yet</div>
            ) : (
              topMessages.map((msg, idx) => (
                <UnopenedMessage
                  key={idx}
                  sender={msg.sender || msg.user_id || 'Unknown'}
                  message={msg.content || msg.text || 'No message'}
                  time={msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                  unread={msg.unread || 0}
                />
              ))
            )}
          </div>
          <div className="dashboard-section">
            <h3>To-Do Today</h3>
            {loading ? (
              <div>Loading...</div>
            ) : todoItems.length === 0 ? (
              <div>No data yet</div>
            ) : (
              todoItems.map((item, idx) => (
                <TodoCard
                  key={idx}
                  title={item.title}
                  description={item.description}
                  dueTime={item.dueTime}
                  status={item.status}
                  onToggle={() => handleToggleTodo()}
                />
              ))
            )}
          </div>
        </div>
      </Box>
      <Box className="section">
        <Box className="dashboard-timeframe-row">
          <h3>Channel Volume</h3>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframe}
            className="dashboard-toggle-group"
            size="small"
          >
            <ToggleButton value="Day">Day</ToggleButton>
            <ToggleButton value="Week">Week</ToggleButton>
            <ToggleButton value="Month">Month</ToggleButton>
            <ToggleButton value="Year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {loading ? (
          <div>Loading...</div>
        ) : channelData.length === 0 && lineData.length === 0 ? (
          <div>No data yet</div>
        ) : (
          <ChartsSection channelData={channelData} lineData={lineData} />
        )}
      </Box>
      <Box className="plain-section">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {loading ? (
            <Grid item xs={12}><div>Loading...</div></Grid>
          ) : cards.length === 0 ? (
            <Grid item xs={12}><div>No data yet</div></Grid>
          ) : (
            cards.map((card, index) => (
              <Grid item xs={12} key={index}>
                <InfoCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  change={card.change}
                  changeColor={card.changeColor}
                  subtext={card.subtext}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Box className="section">
        {loading ? (
          <div>Loading metrics...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div><b>Conversations Today:</b> {metrics.conversationsToday}</div>
            <div><b>Messages Today:</b> {metrics.messagesToday}</div>
            <div><b>Contacts:</b> {metrics.contacts}</div>
            <div><b>Businesses:</b> {metrics.businesses}</div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 