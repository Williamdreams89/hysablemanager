import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import CustomizedTreeView from './CustomizedTreeView';
import StatCard, {StatCardProps} from './StatCard';
import { APIContext } from '../../utils/contexts/ReactContext';
import NavBreadCrumbs from '../NavbarBreadcrumbs';
import { Chart } from 'primereact/chart';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

interface Product {
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
}

const TopSellingProducts: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([
    { name: 'Maize', category: 'Cereals', quantitySold: 540, revenue: 12400 },
    { name: 'Rice', category: 'Cereals', quantitySold: 420, revenue: 11000 },
    { name: 'Beans', category: 'Grains', quantitySold: 310, revenue: 9800 },
    { name: 'Millet', category: 'Cereals', quantitySold: 200, revenue: 7500 },
    { name: 'Sorghum', category: 'Grains', quantitySold: 150, revenue: 6300 },
  ]);

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const categories = ['Cereals', 'Grains'];

  const header = (
    <div className="flex justify-between items-center mb-3">
      <div className="flex gap-2">
        <InputText
          placeholder="Search..."
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          className="p-inputtext-sm"
        />
        <Dropdown
          value={selectedCategory}
          options={categories}
          onChange={(e) => setSelectedCategory(e.value)}
          placeholder="Filter by Category"
          className="p-inputtext-sm"
        />
        <Button icon="pi pi-filter" label="Filter" className="p-button-sm p-button-secondary" />
      </div>
    </div>
  );

  const revenueTemplate = (rowData: Product) => `₵${rowData.revenue.toLocaleString()}`;
  const quantityTemplate = (rowData: Product) => `${rowData.quantitySold} units`;

  const filteredProducts = products.filter((product) => {
    const matchesFilter = globalFilter
      ? product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      product.category.toLowerCase().includes(globalFilter.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesFilter && matchesCategory;
  });

  return (
    <Card title="Top Selling Products" style={{ marginTop: '2rem' }}>
      <DataTable
        value={filteredProducts}
        paginator
        rows={5}
        header={header}
        className="p-datatable-sm"
        responsiveLayout="scroll"
        emptyMessage="No products found."
      >
        <Column field="name" header="Product" sortable></Column>
        <Column field="category" header="Category" sortable></Column>
        <Column field="quantitySold" header="Quantity Sold" body={quantityTemplate} sortable></Column>
        <Column field="revenue" header="Revenue" body={revenueTemplate} sortable></Column>
      </DataTable>
    </Card>
  );
};



import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { drawerClasses } from '@mui/material';
import { ProgressBar } from 'primereact/progressbar';
import { Image } from 'primereact/image';
import { PieChart, Pie, Cell } from 'recharts';



const revenueData = [
  { name: 'Jan', current: 12000, previous: 10000 },
  { name: 'Feb', current: 15000, previous: 14000 },
  { name: 'Mar', current: 18000, previous: 16000 },
  { name: 'Apr', current: 17000, previous: 15000 },
  { name: 'May', current: 21000, previous: 19000 },
  { name: 'Jun', current: 25000, previous: 23000 },
];

const populationData = [
  { class: 'Creche', count: 0 },
  { class: 'Nursery 1', count: 1 },
  { class: 'KG 1', count: 0 },
  { class: 'Primary 1', count: 2 },
  { class: 'JHS 1', count: 0 },
];

const attendanceData = [
  { date: '1-May', Present: 2, Absent: 0 },
  { date: '2-May', Present: 2, Absent: 0 },
  { date: '3-May', Present: 1, Absent: 1 },
  { date: '4-May', Present: 2, Absent: 0 },
];

const data: StatCardProps[] = [
  {
    title: 'Total Sales',
    value: '1,200',
    interval: 'Last 30 days',
    trend: 'up',
    data: [1200, 1220, 1180, 1215, 1190, 1250, 1300, 1280, 1295, 1310, 1350, 1370], // Student enrollment count over time
  },
  {
    title: 'Total Orders',
    value: '95%',
    interval: 'Last 30 days',
    trend: 'up',
    data: [93, 94, 95, 96, 94, 95, 96, 97, 95, 96, 97, 95], // Attendance rate trend
  },
  {
    title: 'Total Revenue',
    value: '850',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [850, 870, 880, 860, 845, 830, 850, 840, 860, 890, 900, 910], // Number of students passing exams
  },
  {
    title: "Total Customers",
    value: "GHS0",
    interval: "Today",
    trend: "neutral",
    data: [1200, 1220, 1180, 1215, 1190, 1250, 1300, 1280, 1295, 1310, 1350, 1370]
  },


];

const chartData = {
  labels: [
    'Jan-2025', 'Feb-2025', 'Mar-2025', 'Apr-2025', 'May-2025', 'Jun-2025',
    'Jul-2025', 'Aug-2025', 'Sep-2025', 'Oct-2025', 'Nov-2025', 'Dec-2025',
    'Jan-2026', 'Feb-2026', 'Mar-2026', 'Apr-2026', 'May-2026', 'Jun-2026',
    'Jul-2026', 'Aug-2026', 'Sep-2026', 'Oct-2026', 'Nov-2026', 'Dec-2026'
  ],
  datasets: [
    {
      label: 'Incomes',
      data: [1000, 800, 4700, 1200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      fill: false,
      borderColor: 'green',
      tension: 0.4
    },
    {
      label: 'Expenditures',
      data: Array(24).fill(0),
      fill: false,
      borderColor: 'brown',
      tension: 0.4
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};



const financeData = [
  { month: 'Jan-2025', income: 1000, expenditure: 0 },
  { month: 'Feb-2025', income: 800, expenditure: 0 },
  { month: 'Mar-2025', income: 4700, expenditure: 0 },
  { month: 'Apr-2025', income: 1200, expenditure: 0 },
  { month: 'May-2025', income: 0, expenditure: 0 },
  { month: 'Jun-2025', income: 0, expenditure: 0 },
  { month: 'Jul-2025', income: 0, expenditure: 0 },
  { month: 'Aug-2025', income: 0, expenditure: 0 },
  { month: 'Sep-2025', income: 0, expenditure: 0 },
  { month: 'Oct-2025', income: 0, expenditure: 0 },
  { month: 'Nov-2025', income: 0, expenditure: 0 },
  { month: 'Dec-2025', income: 0, expenditure: 0 },
  { month: 'Jan-2026', income: 0, expenditure: 0 },
  { month: 'Feb-2026', income: 0, expenditure: 0 },
  { month: 'Mar-2026', income: 0, expenditure: 0 },
  { month: 'Apr-2026', income: 0, expenditure: 0 },
  { month: 'May-2026', income: 0, expenditure: 0 },
  { month: 'Jun-2026', income: 0, expenditure: 0 },
  { month: 'Jul-2026', income: 0, expenditure: 0 },
  { month: 'Aug-2026', income: 0, expenditure: 0 },
  { month: 'Sep-2026', income: 0, expenditure: 0 },
  { month: 'Oct-2026', income: 0, expenditure: 0 },
  { month: 'Nov-2026', income: 0, expenditure: 0 },
  { month: 'Dec-2026', income: 0, expenditure: 0 },
];

const totalSalesdata = [
  { name: 'Direct', value: 400 },
  { name: 'Website', value: 300 },
  { name: 'Social', value: 300 },
];

const COLORS = ['#6366f1', '#22c55e', '#f59e0b']; // Indigo, Green, Amber

const TotalSalesDoughnut = () => {
  const chartData = {
    labels: ['Direct', 'Website', 'Social Media'],
    datasets: [
      {
        data: [400, 300, 300],
        backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'], // Indigo, Green, Amber
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <Card title="Total Sales" className="w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-xs">
          <Chart type="doughnut" data={chartData} options={chartOptions} />
        </div>

        {/* Legend */}
        {/* <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center">
          {chartData.labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <span
                className="w-3 h-3 rounded-full mb-1"
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </Card>
  );
};


// GeoJSON for world map
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const markers = [
  { name: "New York", coordinates: [-74.006, 40.7128], value: "72K" },
  { name: "Accra", coordinates: [-122.4194, 37.7749], value: "39K" },
  { name: "Lome", coordinates: [151.2093, -33.8688], value: "25K" },
  { name: "Abuja ", coordinates: [103.8198, 1.3521], value: "61K" },
];

export const SalesByLocation = () => {
  const salesData = [
    { city: 'New York', value: 72 },
    { city: 'Accra', value: 39 },
    { city: 'Lome', value: 25 },
    { city: 'Abuja', value: 61 },
  ];

  return (
    <Card title="Sales by Location" className="w-full h-full">
      {/* Static World Map */}
      <div className="mb-4">
        <Image
          src="https://i0.wp.com/www.oat.co.uk/wp-content/uploads/2016/05/World_map_blank_without_borders-1.png?resize=600%2C334&ssl=1"
          alt="World Map"
          width="100%"
          height='60%'
          preview={false}
          imageStyle={{ borderRadius: '8px', objectFit: 'cover' }}
        />
      </div>

      {/* Sales Progress List */}
      <div className="flex flex-col gap-3" style={{ width: '100%' }}>
        <div className="" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
          {salesData.map((item, idx) => (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }} key={idx}>
              <div style={{ width: '100%', backgroundColor: '' }}>
                <div className="text-sm text-gray-800 mb-1 font-medium" style={{}}>{item.city}</div>
                <ProgressBar
                  value={item.value}
                  style={{ height: '8px', borderRadius: '8px', width: '100%' }}
                  color={getProgressColor(item.value)}
                  showValue={false} // removes % label
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Helper to choose color by value
function getProgressColor(value: number): string {
  if (value >= 70) return '#6366f1'; // Indigo
  if (value >= 50) return '#22c55e'; // Green
  return '#facc15'; // Yellow
}


const MainGrid: React.FC = () => {
  const context = React.useContext(APIContext)
  if (!context) {
    throw new Error("No context found")
  }
  const { studentsManagementDetails, setStudentsManagementDetails } = context

  React.useEffect(() => {
    console.log("studentMSDATA= ", studentsManagementDetails.fetchedSystemSettings)
  }, [])
  React.useEffect(() => {
    document.title = "Home"
  })

  const chartData = {
    labels: ["Target Achieved", "Remaining"],
    datasets: [
      {
        data: [75, 25], // Update this dynamically if needed
        backgroundColor: ["#42A5F5", "#E0E0E0"],
        hoverBackgroundColor: ["#64B5F6", "#EEEEEE"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box sx={{
      width: '100%', maxWidth: {
        sm: '100%', md: '1700px', backgroundSize: "cover", [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },// or 'contain', 'auto'

      }
    }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{
          mb: (theme) => theme.spacing(2)
        }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}

        <Grid width={"100%"} container spacing={4}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <h2 className="font-semibold text-lg mb-2">Revenue</h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="#4CAF50" name="Current Week" strokeWidth={3} />
                <Line type="monotone" dataKey="previous" stroke="#9C27B0" name="Previous Week" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <SalesByLocation />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <TotalSalesDoughnut />
          </Grid>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6, lg: 12 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
            Monthly Finance Summary | 2025–2026
          </h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" interval={1} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="green" name="Incomes" />
                <Line type="monotone" dataKey="expenditure" stroke="brown" name="Expenditures" />
              </LineChart>
            </ResponsiveContainer>
          </div>


        </Grid> */}
      </Grid>

      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <TopSellingProducts />
        </Grid>
        
      </Grid>

    </Box>
  );
}

export default MainGrid

