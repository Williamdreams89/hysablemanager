import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const data = [
  { label: 'Sabonline', value: 500 },
  { label: 'Broadcasting', value: 350 },
  { label: 'Brigade', value: 300 },
  { label: 'Bonyon', value: 250 },
  { label: 'Dromankuma', value: 200 },
  { label: 'Kotokoliline', value: 150 },
  { label: 'Mempeasem', value: 100 },
  { label: 'Barrier', value: 75 },
  { label: 'Abota', value: 50 },
];

const areas = [
  {
    name: 'Sabonline',
    value: 500,
    color: 'hsl(220, 25%, 65%)',
  },
  {
    name: 'Broadcasting',
    value: 350,
    color: 'hsl(220, 25%, 55%)',
  },
  {
    name: 'Brigade',
    value: 300,
    color: 'hsl(220, 25%, 45%)',
  },
  {
    name: 'Bonyon',
    value: 250,
    color: 'hsl(220, 25%, 40%)',
  },
  {
    name: 'Dromankuma',
    value: 200,
    color: 'hsl(220, 25%, 35%)',
  },
  {
    name: 'Kotokoliline',
    value: 150,
    color: 'hsl(220, 25%, 30%)',
  },
  {
    name: 'Mempeasem',
    value: 100,
    color: 'hsl(220, 25%, 25%)',
  },
  {
    name: 'Barrier',
    value: 75,
    color: 'hsl(220, 25%, 20%)',
  },
  {
    name: 'Abota',
    value: 50,
    color: 'hsl(220, 25%, 15%)',
  },
];

const colors = data.map((area, index) =>
  `hsl(220, 25%, ${65 - index * 5}%)`
);

interface StyledTextProps {
  variant: 'primary' | 'secondary';
}

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledTextProps>(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

export default function ChartStudentByResidence() {
  const totalStudents = data.reduce((sum, area) => sum + area.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Students by Residence
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel
              primaryText={`${totalStudents}`}
              secondaryText="Total Students"
            />
          </PieChart>
        </Box>
        {areas.map((area, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{ alignItems: 'center', gap: 2, pb: 2 }}
          >
            <Stack sx={{ gap: 1, flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {area.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {Math.round((area.value / totalStudents) * 100)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                aria-label="Number of students by residence"
                value={(area.value / totalStudents) * 100}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: area.color,
                  },
                }}
              />
            </Stack>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}
