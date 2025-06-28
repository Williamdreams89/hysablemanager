import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function FeePaymentBarChart() {
  const theme = useTheme();
  const colorPalette = [
    (theme).palette.primary.dark,
    (theme).palette.primary.main,
    (theme).palette.primary.light,
  ];
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
      <Typography component="h2" variant="subtitle2" gutterBottom>
          School Fee Payment Overview
        </Typography>
        <Stack sx={{ justifyContent: 'space-between', mb: 2 }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              85%
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Fees collected this term
            </Typography>
          </Stack>
        </Stack>
        <BarChart
  borderRadius={8} // Rounded corners for bars
  colors={colorPalette}
  xAxis={[
    {
      scaleType: 'band', // Required for bar chart
      // categoryGapRatio: 0.5, // Space between bars
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months
    },
  ]}
  series={[
    {
      id: 'paid',
      label: 'Paid Fees',
      data: [8000, 7500, 9000, 8500, 8900, 9200, 9300], // Example data for paid fees
      stack: 'A', // Stacked with the other series
    },
    {
      id: 'pending',
      label: 'Pending Fees',
      data: [2000, 2500, 1000, 1500, 1100, 800, 700], // Example data for pending fees
      stack: 'A',
    },
    {
      id: 'overdue',
      label: 'Overdue Fees',
      data: [500, 700, 400, 300, 200, 150, 120], // Example data for overdue fees
      stack: 'A',
    },
  ]}
  height={250}
  margin={{ left: 50, right: 0, top: 20, bottom: 20 }} // Adjust chart spacing
  grid={{ horizontal: true }} // Add grid lines for readability
  slotProps={{
    legend: {
      hidden: true, // Hide legend for simplicity; remove this line to display it
    },
  }}
/>

      </CardContent>
    </Card>
  );
}
