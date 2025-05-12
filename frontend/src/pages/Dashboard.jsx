import React from 'react';
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

const initialTodoItems = [
  {
    title: 'Draft marketing plan for Q2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ......',
    dueTime: '13:45',
    status: 'done',
  },
  {
    title: 'Prepare client onboarding docs',
    description: 'Ensure all onboarding documents are ready for the new client meeting tomorrow.',
    dueTime: '09:00',
    status: 'pending',
  },
  {
    title: 'Review sales pipeline',
    description: 'Go through the sales pipeline and update the status of all leads.',
    dueTime: '17:00',
    status: 'pending',
  },
];

const Dashboard = () => {
  const [todoItems, setTodoItems] = React.useState(initialTodoItems);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeframe, setTimeframe] = React.useState('Month');

  const handleToggleTodo = (idx) => {
    setTodoItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
          : item
      )
    );
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

  const cards = [
    {
      title: 'Active Conversations',
      value: 55,
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: 'var(--marian-blue)' }} />,
      change: '↑ 9.2%',
      changeColor: '#4caf50',
      subtext: 'vs last period'
    },
    {
      title: 'Recovered Leads',
      value: 8,
      icon: <ReplayIcon sx={{ fontSize: 28, color: 'var(--orange-crayola)' }} />,
      change: '↑ 4.5%',
      changeColor: '#4caf50',
      subtext: 'vs last period'
    },
    {
      title: 'Resolution Rate',
      value: '85%',
      icon: <TrendingUpIcon sx={{ fontSize: 28, color: 'var(--desert-sand)' }} />,
      change: '↑ 2.1%',
      changeColor: '#4caf50',
      subtext: 'vs last period'
    },
    {
      title: 'Filtered Conversations',
      value: 23,
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: 'var(--orange-crayola)' }} />,
      change: '↑ 3.7%',
      changeColor: '#4caf50',
      subtext: 'vs last period'
    }
  ];

  const topMessages = [
    {
      sender: 'Kelly Marce',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ......',
      time: '13:45',
      unread: 2,
    },
    {
      sender: 'David Kim',
      message: 'Client is waiting for your response.',
      time: '12:10',
      unread: 1,
    },
    {
      sender: 'Support Bot',
      message: 'Reminder: Follow up with new leads.',
      time: '09:30',
      unread: 1,
    },
  ];

  // Example data for each timeframe
  const channelDataMap = {
    Day: [
      { name: 'Email', value: 20 },
      { name: 'SMS', value: 15 },
      { name: 'Phone', value: 10 },
      { name: 'Slack', value: 5 },
    ],
    Week: [
      { name: 'Email', value: 120 },
      { name: 'SMS', value: 90 },
      { name: 'Phone', value: 60 },
      { name: 'Slack', value: 30 },
    ],
    Month: [
      { name: 'Email', value: 400 },
      { name: 'SMS', value: 300 },
      { name: 'Phone', value: 200 },
      { name: 'Slack', value: 100 },
    ],
    Year: [
      { name: 'Email', value: 4800 },
      { name: 'SMS', value: 3600 },
      { name: 'Phone', value: 2400 },
      { name: 'Slack', value: 1200 },
    ],
  };
  const lineDataMap = {
    Day: [
      { time: '8am', Email: 2, SMS: 1, Phone: 1, Slack: 0 },
      { time: '10am', Email: 3, SMS: 2, Phone: 1, Slack: 1 },
      { time: '12pm', Email: 5, SMS: 3, Phone: 2, Slack: 1 },
      { time: '2pm', Email: 4, SMS: 4, Phone: 2, Slack: 1 },
      { time: '4pm', Email: 3, SMS: 2, Phone: 2, Slack: 1 },
      { time: '6pm', Email: 3, SMS: 3, Phone: 2, Slack: 1 },
    ],
    Week: [
      { time: 'Mon', Email: 20, SMS: 15, Phone: 10, Slack: 5 },
      { time: 'Tue', Email: 18, SMS: 14, Phone: 9, Slack: 4 },
      { time: 'Wed', Email: 22, SMS: 16, Phone: 11, Slack: 6 },
      { time: 'Thu', Email: 19, SMS: 13, Phone: 10, Slack: 5 },
      { time: 'Fri', Email: 21, SMS: 17, Phone: 12, Slack: 7 },
      { time: 'Sat', Email: 10, SMS: 8, Phone: 6, Slack: 3 },
      { time: 'Sun', Email: 10, SMS: 7, Phone: 5, Slack: 2 },
    ],
    Month: [
      { time: 'Jan', Email: 100, SMS: 80, Phone: 60, Slack: 30 },
      { time: 'Feb', Email: 120, SMS: 90, Phone: 50, Slack: 20 },
      { time: 'Mar', Email: 90, SMS: 70, Phone: 40, Slack: 25 },
      { time: 'Apr', Email: 110, SMS: 60, Phone: 30, Slack: 15 },
      { time: 'May', Email: 130, SMS: 100, Phone: 20, Slack: 10 },
      { time: 'Jun', Email: 140, SMS: 120, Phone: 50, Slack: 0 },
    ],
    Year: [
      { time: '2023', Email: 800, SMS: 600, Phone: 400, Slack: 200 },
      { time: '2024', Email: 4000, SMS: 3000, Phone: 2000, Slack: 1000 },
    ],
  };
  const channelData = channelDataMap[timeframe];
  const channelVolumeOverTime = lineDataMap[timeframe];

  return (
    <Box className="page-container">
      <Box className="dashboard-topbar">
        <h1>
          Welcome Zeke G.
        </h1>
        <Box className="dashboard-topbar-actions">
          <Search />
          <IconButton size="large" className="dashboard-profile-icon" onClick={handleProfileMenuOpen}>
            <AccountCircle fontSize="large" />
          </IconButton>
          <span className="dashboard-username">Zeke</span>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            className="dashboard-profile-menu"
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box className="section">
        <div className="dashboard-sections-row">
          <div className="dashboard-section">
            <h3>Action Required</h3>
            {topMessages.map((msg, idx) => (
              <UnopenedMessage
                key={idx}
                sender={msg.sender}
                message={msg.message}
                time={msg.time}
                unread={msg.unread}
              />
            ))}
          </div>
          <div className="dashboard-section">
            <h3>To-Do Today</h3>
            {todoItems.map((item, idx) => (
              <TodoCard
                key={idx}
                title={item.title}
                description={item.description}
                dueTime={item.dueTime}
                status={item.status}
                onToggle={() => handleToggleTodo(idx)}
              />
            ))}
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
        <ChartsSection channelData={channelData} lineData={channelVolumeOverTime} />
      </Box>
      <Box className="plain-section">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {cards.map((card, index) => (
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
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 