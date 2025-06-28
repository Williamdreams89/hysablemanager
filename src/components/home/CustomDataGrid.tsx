import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface FlowData {
  id: number;
  date: string;
  category: string;
  description: string;
  type: string;
  amount: number;
}

const rows: FlowData[] = [
  { id: 1, date: '2024-01-05', category: 'Tuition Fees', description: 'Monthly fee collection', type: 'Income', amount: 15000 },
  { id: 2, date: '2024-01-07', category: 'Staff Salaries', description: 'Teachers\' salaries payment', type: 'Expenditure', amount: 8500 },
  { id: 3, date: '2024-01-10', category: 'Donations', description: 'Alumni donation', type: 'Income', amount: 2000 },
  { id: 4, date: '2024-01-12', category: 'Utilities', description: 'Electricity bill', type: 'Expenditure', amount: 1200 },
  { id: 5, date: '2024-01-15', category: 'Miscellaneous Fees', description: 'Sports activity fee', type: 'Income', amount: 1500 },
  { id: 6, date: '2024-01-20', category: 'Maintenance', description: 'Building repairs', type: 'Expenditure', amount: 3000 },
  { id: 7, date: '2024-01-25', category: 'Events', description: 'Science fair sponsorship', type: 'Income', amount: 1800 },
  { id: 8, date: '2024-01-28', category: 'Books/Resources', description: 'Library book purchases', type: 'Expenditure', amount: 900 },
  { id: 9, date: '2024-02-01', category: 'Tuition Fees', description: 'Monthly fee collection', type: 'Income', amount: 15500 },
  { id: 10, date: '2024-02-03', category: 'Utilities', description: 'Water supply payment', type: 'Expenditure', amount: 500 },
  { id: 11, date: '2024-02-07', category: 'Scholarships', description: 'Merit-based scholarship', type: 'Expenditure', amount: 2000 },
  { id: 12, date: '2024-02-10', category: 'Transport Fees', description: 'Bus fee collection', type: 'Income', amount: 4000 },
  { id: 13, date: '2024-02-12', category: 'Staff Salaries', description: 'Administrative staff salaries', type: 'Expenditure', amount: 3000 },
  { id: 14, date: '2024-02-14', category: 'Stationery Sales', description: 'School merchandise', type: 'Income', amount: 1200 },
  { id: 15, date: '2024-02-18', category: 'Maintenance', description: 'Playground equipment repair', type: 'Expenditure', amount: 1100 },
  { id: 16, date: '2024-02-22', category: 'Examination Fees', description: 'Exam fee collection', type: 'Income', amount: 2500 },
  { id: 17, date: '2024-02-25', category: 'Marketing', description: 'Advertisement for new session', type: 'Expenditure', amount: 1500 },
  { id: 18, date: '2024-02-28', category: 'Utilities', description: 'Internet bill', type: 'Expenditure', amount: 300 },
  { id: 19, date: '2024-03-01', category: 'Tuition Fees', description: 'Monthly fee collection', type: 'Income', amount: 16000 },
  { id: 20, date: '2024-03-05', category: 'Maintenance', description: 'Classroom repairs', type: 'Expenditure', amount: 2800 },
];

const columns: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'category', headerName: 'Category', width: 200 },
  // { field: 'description', headerName: 'Description', width: 300 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'amount', headerName: 'Amount (USD)', type: 'number', width: 150 },
];

export default function IncomeExpenditureTable() {
  return (
    <div style={{  width: '100%' }}>
      <DataGrid
        // sx={{height:""}}
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
