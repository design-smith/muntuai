import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  BarChartDisplay,
  LineChartDisplay,
  PieChartDisplay,
  DonutChartDisplay
} from './ChartsSection';

// Reusable Table component
export function TableDisplay({ columns = [], rows = [] }) {
  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell className="table-header" key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell className="table-cell" key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Reusable Carousel component
export function CarouselDisplay({ items = [], renderItem }) {
  return (
    <Grid container spacing={2} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
      {items.map((item, idx) => (
        <Grid item key={idx} sx={{ minWidth: 200 }}>
          {renderItem ? renderItem(item, idx) : (
            <Card className="card">
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography>{item.content}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  );
}

const DataDisplayElements = () => {
  return (
    <>
      <Box className="section">
        <Typography className="heading-secondary">Charts</Typography>
        <ChartsSection />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Table</Typography>
        <TableDisplay columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'status', label: 'Status' }]} rows={[{ name: 'John Doe', email: 'john@example.com', status: 'Active' }, { name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' }, { name: 'Alice Brown', email: 'alice@example.com', status: 'Inactive' }]} />
      </Box>

      <Box className="section">
        <Typography className="heading-secondary">Carousel</Typography>
        <CarouselDisplay items={[
          { title: 'Card 1', content: 'Simple text inside carousel card.' },
          { title: 'Card 2', content: 'Simple text inside carousel card.' },
          { title: 'Card 3', content: 'Simple text inside carousel card.' },
          { title: 'Card 4', content: 'Simple text inside carousel card.' },
          { title: 'Card 5', content: 'Simple text inside carousel card.' }
        ]} />
      </Box>
    </>
  );
};

export default DataDisplayElements; 