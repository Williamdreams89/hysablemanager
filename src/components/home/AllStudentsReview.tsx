import React from "react";
import { DataGrid, GridColDef, GridRowsProp, GridRenderCellParams } from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

type Performance = {
  class: string;
  trimester: string;
  averageExamScore: number;
};

type StudentRow = {
  id: number;
  name: string;
  studentId: string;
  currentClass: string;
  performance: Performance[];
};

const studentData: StudentRow[] = [
  {
    id: 1,
    name: "Danquah William",
    studentId: "ST001",
    currentClass: "BS1",
    performance: [
      { class: "BS1", trimester: "First", averageExamScore: 75 },
      { class: "BS1", trimester: "Second", averageExamScore: 85 },
      { class: "BS1", trimester: "Third", averageExamScore: 78 },
    ],
  },
  {
    id: 2,
    name: "Jane Doe",
    studentId: "ST002",
    currentClass: "KG1",
    performance: [
      { class: "KG1", trimester: "First", averageExamScore: 80 },
      { class: "KG1", trimester: "Second", averageExamScore: 88 },
      { class: "KG1", trimester: "Third", averageExamScore: 82 },
    ],
  },
  // Add more students as needed...
];

function renderSparklineCell(params: GridRenderCellParams<Performance[]>) {
  const { value } = params;

  if (!value || value.length === 0) {
    return null;
  }

  const data = value.map((entry:any) => ({
    label: `${entry.class} ${entry.trimester}`,
    value: entry.averageExamScore,
  }));

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={data}
        width={params.colDef.computedWidth || 150}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
        xAxis={{
          scaleType: "band",
          data: data.map((d:any) => d.label),
        }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "studentId", headerName: "Student ID", flex: 0.5, minWidth: 100 },
  { field: "currentClass", headerName: "Current Class", flex: 0.5, minWidth: 100 },
  {
    field: "performance",
    headerName: "Performance",
    flex: 1,
    minWidth: 200,
    renderCell: renderSparklineCell,
    sortable: false,
  },
];

export default function AllStudentsReview() {
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid rows={studentData} columns={columns} />
    </div>
  );
}
