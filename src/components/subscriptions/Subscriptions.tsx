import { Props } from '../../components/people/students/types';
import NavBreadCrumbs from '../NavbarBreadcrumbs';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from 'primereact/button';

interface Bill {
  id: number;
  description: string;
  amount: number;
  due_date: string;
  paid: boolean;
}

const Subscriptions: React.FC<Props> = ({
  SystemSettingData,
  academicSessionSettingsData,
  academicSettingsData
}) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const clientId = 2;

  useEffect(() => {
    axios
      .get(`https://server.schsms.xyz/subscriptions/client/${clientId}/bills/`)
      .then((response) => setBills(response.data))
      .catch((error) => console.error('Error fetching bills:', error));
  }, []);

  const handlePaymentSuccess = (billId: number) => {
    console.log('Payment success for bill', billId);
    axios
      .post(`https://server.schsms.xyz/subscriptions/bills/${billId}/mark_paid/`)
      .then(() => {
        axios
          .get(`https://server.schsms.xyz/subscriptions/client/${clientId}/bills/`)
          .then((res) => {
            setBills(res.data);
          });
      });
  };

  const paymentButtonTemplate = (rowData: Bill) => {
    if (rowData.paid) return <span style={{ color: 'green' }}>Paid</span>;

    const config = {
  public_key: 'FLWPUBK_TEST-3f60ad7403bf2f9b6ff5e7c6ac34417e-X',
  tx_ref: `billing-${rowData.id}-${Date.now()}`,
  amount: rowData.amount,
  currency: 'GHS',
  payment_options: 'card,mobilemoneyghana, banktransfer',
  customer: {
    email: 'client@example.com',
    phone_number: '054XXXXXXX',
    name: 'Client Name'
  },
  customizations: {
    title: 'Client Billing Payment',
    description: `Payment for bill #${rowData.id}`,
    logo: '/images/logo.png'
  },
  callback: (response: any) => {
    if (response.status === 'successful') {
      handlePaymentSuccess(rowData.id);
      closePaymentModal();
    }
  },
  onClose: () => {
    console.log('Flutterwave modal closed');
  }
};


    return (
      <FlutterWaveButton
    {...config}
    className='p-button p-button-sm p-button-warning'
    text="Pay Now"
    
    onClose={() => {
      console.log("Payment modal closed");
    }}
  />
    );
  };

  return (
    <Box sx={{ width: '100%', backgroundImage: `url('/images/formbg2.jpg')`, // Use a relative path or full URL
      backgroundSize: "cover", // or 'contain', 'auto'
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "400px",
      backgroundPositionY: 'fixed',
      backgroundPositionX: 'fixed', }}>
      <NavBreadCrumbs
        academicSessionSettingsData={academicSessionSettingsData}
        academicSettingsData={academicSettingsData}
        items={[{ label: 'Subscriptions' }]}
      />

      <div className="p-4">
        <h2>Client Bills</h2>
        <DataTable value={bills} paginator rows={5} stripedRows>
          <Column field="id" header="#" />
          <Column field="amount" header="Amount (GHS)" />
          <Column field="due_date" header="Due Date" />
          <Column header="Status" body={paymentButtonTemplate} />
        </DataTable>
      </div>
    </Box>
  );
};

export default Subscriptions;
