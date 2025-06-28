import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

type SparkLineData = number[];

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'studentName', headerName: 'Student Name', width: 180 },
  { field: 'className', headerName: 'Class', width: 120 },
  { field: 'attendance', headerName: 'Attendance', width: 240, type: 'number', headerAlign: 'center',  renderCell: renderAttendanceSparklineCell },
  { field: 'performanceTrend', headerName: 'Academic Performance', width: 200, renderCell: renderSparklineCell },
  
];

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data: SparkLineData = params.value || [];
  const width = params.colDef.computedWidth || 600;

  return data.length > 0 ? (
    <SparkLineChart
      data={data}
      width={width}
      height={32}
      plotType="bar"
      showHighlight
      showTooltip
      colors={['hsl(210, 98%, 42%)']}
      xAxis={{
        scaleType: 'band',
        data,
      }}
    />
  ) : (
    <span>No Data</span>
  );
}

type AttendanceSparkLineData = number[];

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

function renderAttendanceSparklineCell(params: GridCellParams<AttendanceSparkLineData, any>) {
  const data = getDaysInMonth(4, 2024);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={['hsl(210, 98%, 42%)']}
        xAxis={{
          scaleType: 'band',
          data,
        }}
      />
    </div>
  );
}

export const rows = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  studentName: `Student ${index + 1}`,
  className: index < 5 ? 'KG1' : index < 10 ? 'KG2' : index < 15 ? 'BS1' : index < 20 ? 'BS2' : index < 25 ? 'JHS1' : 'JHS2',
  attendance: Array.from({ length: 20 }, () => Math.floor(Math.random() * 1000) + 19),       // Random attendance percentage between 0 and 100
  performanceTrend: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1),  // 10 random data points for sparkline
}));


