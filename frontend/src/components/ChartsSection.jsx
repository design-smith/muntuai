import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line
} from 'recharts';

const CHANNEL_COLORS = ['#3C4884', '#FF7125', '#21a300', '#611f69'];
const CHANNEL_LABELS = ['Email', 'SMS', 'Phone', 'Slack'];

const CHANNEL_CSS_VARS = [
  'var(--channel-color-0)',
  'var(--channel-color-1)',
  'var(--channel-color-2)',
  'var(--channel-color-3)',
];

function ChannelLegend({ data }) {
  return (
    <Box className="channel-legend">
      {data.map((entry, idx) => (
        <span key={entry.name} className="channel-legend-item">
          <span className={`channel-legend-color channel-legend-color-${idx}`} data-channel-idx={idx}></span>
          <span className="channel-legend-label">{entry.name}</span>
        </span>
      ))}
    </Box>
  );
}

// Bar Chart
export function BarChartDisplay({ data, title = 'Bar Chart' }) {
  // Chart colors are set via CSS classes, not inline styles
  return (
    <Box className="chart-section">
      <Typography variant="h6" className="chart-title chart-title-bar">{title}</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#263043" />
          <XAxis dataKey="name" stroke="#B0BEC5" />
          <YAxis stroke="#B0BEC5" />
          <RechartTooltip contentStyle={{ backgroundColor: '#232B3E', border: `1px solid var(--bar-color)`, color: '#fff' }} />
          <Bar dataKey="value" fill="var(--bar-color)" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </Box>
  );
}

// Line/Area Chart with Gradient
export function LineChartDisplay({ data, title = 'Line Chart' }) {
  const channels = ['Email', 'SMS', 'Phone', 'Slack'];
  return (
    <Box className="chart-section">
      <Typography variant="h6" className="chart-title">{title}</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <ReLineChart data={data}>
          <defs>
            {channels.map((ch, idx) => (
              <linearGradient key={ch} id={`line-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--channel-color-${idx})`} stopOpacity={0.18} />
                <stop offset="95%" stopColor={`var(--channel-color-${idx})`} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#263043" />
          <XAxis dataKey="time" stroke="#B0BEC5" />
          <YAxis stroke="#B0BEC5" />
          <RechartTooltip contentStyle={{ backgroundColor: '#232B3E', color: '#fff' }} />
          {channels.map((ch, idx) => (
            <Area
              key={`area-${ch}`}
              type="monotone"
              dataKey={ch}
              stroke="none"
              fill={`url(#line-gradient-${idx})`}
              fillOpacity={1}
            />
          ))}
          {channels.map((ch, idx) => (
            <Line
              key={`line-${ch}`}
              type="monotone"
              dataKey={ch}
              stroke={`var(--channel-color-${idx})`}
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </Box>
  );
}

// Pie Chart
export function PieChartDisplay({ data, title = 'Pie Chart' }) {
  // Chart colors are set via CSS classes, not inline styles
  return (
    <Box className="chart-section">
      <Typography variant="h6" className="chart-title chart-title-pie">{title}</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} className={`pie-segment pie-segment-${index}`} />
            ))}
          </Pie>
          <RechartTooltip contentStyle={{ backgroundColor: '#232B3E', border: `1px solid var(--pie-color)`, color: '#fff' }} />
        </RePieChart>
      </ResponsiveContainer>
    </Box>
  );
}

// Donut Chart
export function DonutChartDisplay({ data, title = 'Donut Chart', innerRadius = 70, outerRadius = 110, ...props }) {
  // Chart colors are set via CSS classes and CSS variables
  return (
    <Box className="chart-section donut-no-border">
      <Typography variant="h6" className="chart-title chart-title-donut">{title}</Typography>
      <ResponsiveContainer width="100%" height={320}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey="value"
            cornerRadius={20}
            {...props}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} className={`donut-segment donut-segment-${index}`} />
            ))}
          </Pie>
          <RechartTooltip contentStyle={{ backgroundColor: '#232B3E', color: '#fff' }} />
        </RePieChart>
      </ResponsiveContainer>
    </Box>
  );
}

const ChartsSection = ({ channelData, lineData }) => {
  return (
    <Box className="chart-section charts-section-root">
      <Box className="dashboard-charts-row">
        <Box width={260} minWidth={200}>
          <DonutChartDisplay data={channelData} title="" />
        </Box>
        <Box flex={1}>
          <LineChartDisplay data={lineData} title="" />
        </Box>
      </Box>
      <ChannelLegend data={channelData} />
    </Box>
  );
};

export default ChartsSection; 