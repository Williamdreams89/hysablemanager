import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';



function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SessionsChart() {
  const theme = useTheme();
  const data = getDaysInMonth(4, 2024);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Teacher & User Logins
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              13,277
            </Typography>
            <Chip size="small" color="success" label="+35%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Logins per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: 'teachers',
              label: 'Teachers',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [
                1200, 1300, 1100, 1200, 1400, 1600, 1700, 1500, 1600, 1800, 1700, 1900,
                2000, 2100, 2200, 2300, 2400, 2500, 2400, 2300, 2500, 2600, 2700,
                2800, 2900, 3000, 3100, 3200, 3300, 3400,
              ],
            },
            {
              id: 'staff',
              label: 'Staff',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [
                800, 700, 850, 900, 950, 1050, 1100, 1200, 1250, 1300, 1350, 1400,
                1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950,
                2000, 2050, 2100, 2150, 2200, 2250, 2300,
              ],
            },
            {
              id: 'admin',
              label: 'Admin',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: [
                100, 200, 150, 180, 200, 220, 240, 260, 280, 300, 320, 340,
                360, 380, 400, 420, 440, 460, 480, 500, 520, 540, 560,
                580, 600, 620, 640, 660, 680, 700,
              ],
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-teachers': {
              fill: "url('#teachers')",
            },
            '& .MuiAreaElement-series-staff': {
              fill: "url('#staff')",
            },
            '& .MuiAreaElement-series-admin': {
              fill: "url('#admin')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="teachers" />
          <AreaGradient color={theme.palette.primary.main} id="staff" />
          <AreaGradient color={theme.palette.primary.light} id="admin" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
