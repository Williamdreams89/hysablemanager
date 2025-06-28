import React, { useRef } from "react"; // Import useRef
import { FiPlusSquare, FiSettings } from "react-icons/fi";
import { Shuffle } from "@mui/icons-material";
import axios from "axios";
import NavBreadCrumbs from "../NavbarBreadcrumbs";
import { APIContext } from "../../utils/contexts/ReactContext";
import { TermSessionProps } from "../people/students/types";

// PrimeReact Components
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast'; // Import Toast

// PrimeIcons for consistency if desired, but FiPlusSquare and FiSettings are fine too
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import axiosInstance from '../../utils/axiosInstance'

interface DataProps {
  label: string;
  value: string;
}

interface AcademicTerm {
  id: any;
  session: string;
  term_name: string;
  start_year: string;
  end_year: string;
  is_active: any;
}

interface AcademicSessionType {
  start_year: number;
  end_year: number;
  is_active: boolean;
  academic_year: number;
}

type CustomTarget = { name: string; value: any; type?: string; checked?: boolean };
type CustomChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: CustomTarget };

const SystemSettings: React.FC<TermSessionProps> = ({
  academicSettingsData,
  academicSessionSettingsData,
  SystemSettingData,
}) => {
  const [value, setValue] = React.useState(0);
  const [imagePreview, setImagePreview] = React.useState<string>("/images/logo.png");
  const [imagePreview2, setImagePreview2] = React.useState<string>("/images/pale-education.png");
  const [imagePreview3, setImagePreview3] = React.useState<string>("/images/logo.png");
  const [rowTerm, setRowTerm] = React.useState<any>([]);
  const [rowSession, setRowSession] = React.useState<any>([]);
  const [fetchedSessions, setFetchedSessions] = React.useState<DataProps[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<any>(null);
  const [selectedTerm, setSelectedTerm] = React.useState<any>(null);
  const [fetchedAcademicYear, setFetchedAcademicYear] = React.useState<any>();
  const [fetchedAcademicTerms, setFetchedAcademicTerms] = React.useState<{ value: string; label: string }[]>([]);
  const [termSwitcherOpen, setTermSwitcherOpen] = React.useState<boolean>(false);
  const [academicTermSwitcherOpen, setAcademicTermSwitcherOpen] = React.useState<boolean>(false);
  const [academicSessionSwitcherOpen, setAcademicSessionSwitcherOpen] = React.useState<boolean>(false);

  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error('There must be context');
  }
  const { studentsManagementDetails, setStudentsManagementDetails } = context;

  // Ref for the Toast component
  const toast = useRef<Toast>(null);

  const [academicSessionForm, setAcademicSessionForm] = React.useState<AcademicSessionType>({
    start_year: 0,
    end_year: 0,
    academic_year: 0,
    is_active: false,
  });
  const [academicTermForm, setAcademicTermForm] = React.useState<{ term_name: string; session: string; is_active: boolean }>({
    term_name: "",
    session: "",
    is_active: false,
  });

  const [formData, setFormData] = React.useState({
    active_services: "portal_website",
    school_name: "",
    principal_name: "",
    school_motto: "",
    mission: "",
    vision: "",
    core_values: "",
    school_email: "",
    school_phone: "",
    fees_support_contact: "",
    school_address: "",
    country: "",
    city_state: "",
    currency_symbol: "",
    school_website: "",
    absence_sms_to_parent: false,
    head_staff_title: "",
  });

  const [activeAcademicData, setActiveAcademic] = React.useState<any>();

  // Function to fetch academic terms
  const fetchAcademicTermsData = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axiosInstance.get('/api/academic-term/');
      setRowTerm(data);
      setStudentsManagementDetails({ isLoading: false });
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to fetch academic terms: ${error}`, life: 3000 });
    }
  };

  // Function to fetch academic sessions
  const fetchAcademicSessionsData = async () => {
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axiosInstance.get('/api/academic-sessions/');
      setRowSession(data);
      const sessionList = data.map((session: any) => ({
        label: session.session,
        value: session.id,
      }));
      setFetchedSessions(sessionList);
      setStudentsManagementDetails({ isLoading: false });
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to fetch academic sessions: ${error}`, life: 3000 });
    }
  };

  React.useEffect(() => {
    fetchAcademicTermsData();
    fetchAcademicSessionsData(); // Fetch sessions on initial load
  }, []);

  React.useEffect(() => {
    if (academicSettingsData && Array.isArray(academicSettingsData)) {
      const activeTerm = academicSettingsData.find((term: AcademicTerm) => term.is_active === true);
      setActiveAcademic(activeTerm);
    } else {
      console.log("academicSettingsData is not an array:", academicSettingsData);
    }

    if (Array.isArray(SystemSettingData) && SystemSettingData.length > 0) {
      setFormData(SystemSettingData[0]);
    } else {
      console.warn("data array is empty or not an array");
    }
  }, [academicSettingsData, SystemSettingData]);

  const handleTabChange = (e: { index: number }) => {
    setValue(e.index);
  };

  const handleNewSessionSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setStudentsManagementDetails({ isLoading: true });
      const { data } = await axiosInstance.post(`/api/academic-sessions/`,
        {
          start_year: academicSessionForm.start_year,
          end_year: academicSessionForm.end_year,
          is_active: academicSessionForm.is_active,
          academic_year: academicSessionForm.academic_year
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setStudentsManagementDetails({ isLoading: false });
      setAcademicSessionSwitcherOpen(false);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Academic session created successfully!', life: 3000 });
      fetchAcademicSessionsData(); // Re-fetch sessions to update DataTable
      // Reset form
      setAcademicSessionForm({
        start_year: 0,
        end_year: 0,
        academic_year: 0,
        is_active: false,
      });
    } catch (error) {
      setStudentsManagementDetails({ isLoading: false });
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to create academic session: ${error}`, life: 3000 });
    }
  };

  const handleSwitchOver = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedSession && selectedYear && selectedTerm) {
      try {
        setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: true });
        const { data } = await axiosInstance.post(`/api/academic/settings/activate/${selectedSession}/${selectedTerm}/`);
        console.log("Activation data=", data);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Academic session/term switched successfully!', life: 3000 });
        window.location.reload(); // Still reloading for full app context change (active session)
        setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
        setTermSwitcherOpen(false);
      } catch (error) {
        setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to switch session/term: ${error}`, life: 3000 });
      }
    } else {
      toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please select session, year, and term.', life: 3000 });
    }
  };

  const handleAcademicTermSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setStudentsManagementDetails({ isLoading: true });

      const { data } = await axiosInstance.post("/api/academic-term/create",
        { term_name: academicTermForm.term_name, session: academicTermForm.session, is_active: academicTermForm.is_active },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setStudentsManagementDetails({ isLoading: false });
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Academic term created successfully!', life: 3000 });
      setAcademicTermSwitcherOpen(false);
      fetchAcademicTermsData(); // Re-fetch terms to update DataTable
      // Reset form
      setAcademicTermForm({
        term_name: "",
        session: "",
        is_active: false,
      });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to create academic term: ${error}`, life: 3000 });
      setStudentsManagementDetails({ isLoading: false });
    }
  };

  const handleChange = (e: CustomChangeEvent) => {
    const target = (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>).target || (e as { target: CustomTarget }).target;

    const { name, value } = target;
    const type = 'type' in target ? target.type : undefined;
    const checked = 'checked' in target ? target.checked : undefined;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: true });
      const response = await axiosInstance.put(`/api/system-settings/update/`, formData);
      console.log("saved=", response.data);
      setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'System settings saved successfully!', life: 3000 });
      window.location.reload(); // Still reloading for full app context change (active settings)
    } catch (error) {
      setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
      toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to save system data: ${error}`, life: 3000 });
    }
    console.log("Form Data Submitted:", formData);
  };

  // DataTable Column Templates
  const termStatusBodyTemplate = (rowData: AcademicTerm) => {
    return (
      <div>
        {rowData.is_active ? (
          <Button label="Active Academic Term" className="p-button-outlined p-button-sm" style={{ width: '180px' }} />
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const sessionStatusBodyTemplate = (rowData: AcademicTerm) => {
    return (
      <div>
        {rowData.is_active ? (
          <Button label="Active Academic Session" className="p-button-outlined p-button-sm" style={{ width: '180px' }} />
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <Toast ref={toast} /> {/* Toast component */}
      <NavBreadCrumbs academicSessionSettingsData={academicSessionSettingsData} academicSettingsData={academicSettingsData} items={[{ label: "General Settings" }]} />
      {studentsManagementDetails.isLoading && (
        <div className="flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <ProgressSpinner />
        </div>
      )}
      <TabView activeIndex={value} onTabChange={handleTabChange}>
        <TabPanel header="Academic Session" style={{ width: "100%" }}>
          <div className="card">
            <div
              className="flex flex-column md:flex-row gap-3 align-items-center justify-content-start border-1 surface-border p-4 mb-4"
              style={{ borderRadius: '6px' }}
            >
              <div
                className="border-1 border-round-2xl p-3 shadow-5"
                style={{ width: "fit-content" }}
              >
                <p>
                  Active Academic Session:{" "}
                  <span style={{ fontWeight: 900 }}>{activeAcademicData?.session}</span>
                </p>
                <p>
                  Active Academic Year:{" "}
                  <span style={{ fontWeight: 900 }}>{new String(activeAcademicData?.session).split("-")[0]}</span>
                </p>
                <p>
                  Active Academic Term:{" "}
                  <span style={{ fontWeight: 900 }}>{activeAcademicData?.term_name}</span>
                </p>
              </div>
              <Button onClick={() => setTermSwitcherOpen(true)} className="p-button-raised">
                <Shuffle className="mr-2" />
                <span>Switch Session/Term</span>
              </Button>

              <Dialog
                header="Change Academic Session / Term"
                visible={termSwitcherOpen}
                onHide={() => setTermSwitcherOpen(false)}
                modal
                className="p-fluid"
                style={{ width: '90vw', maxWidth: '700px' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
              >
                <div className="formgrid grid">
                  <div className="field col-12 md:col-4">
                    <label htmlFor="activeSession" className="font-bold">Active Academic Session</label>
                    <Dropdown
                      id="activeSession"
                      value={selectedSession}
                      options={fetchedSessions}
                      onChange={(e) => {
                        const value = e.value;
                        setSelectedSession(value);

                        if (!value) return;

                        const academicYearFetch = async () => {
                          try {
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: true });
                            const response = await axiosInstance.get(`/api/academic-sessions/${value}/`);
                            setFetchedAcademicYear(response.data.academic_year);
                            setSelectedYear(response.data.academic_year);
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
                          } catch (error) {
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: "Network error fetching academic year", life: 3000 });
                          }
                        };

                        const academicTermsFetch = async () => {
                          try {
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: true });
                            const response = await axiosInstance.get(`/api/academic-terms-by-session/${value}/`);
                            setFetchedAcademicTerms(response.data.map((term: any) => ({ value: term.id, label: term.term_name })));
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
                          } catch (error) {
                            setStudentsManagementDetails({ ...studentsManagementDetails, isLoading: false });
                            toast.current?.show({ severity: 'error', summary: 'Error', detail: "Terms not available for this session", life: 3000 });
                          }
                        };

                        academicTermsFetch();
                        academicYearFetch();
                      }}
                      placeholder="Select Session"
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor="activeYear" className="font-bold">Active Academic Year</label>
                    <Dropdown
                      id="activeYear"
                      value={selectedYear}
                      options={fetchedAcademicYear ? [{ value: fetchedAcademicYear, label: fetchedAcademicYear }] : []}
                      onChange={(e) => setSelectedYear(e.value)}
                      placeholder="Select Academic Year"
                      disabled={!fetchedAcademicYear}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor="activeTerm" className="font-bold">Active Academic Term</label>
                    <Dropdown
                      id="activeTerm"
                      value={selectedTerm}
                      options={fetchedAcademicTerms}
                      onChange={(e) => setSelectedTerm(e.value)}
                      placeholder="Select Term"
                    />
                  </div>
                </div>
                <div className="flex justify-content-center pt-4">
                  <Button onClick={handleSwitchOver} label={studentsManagementDetails.isLoading === true ? "...please wait" : "Switch Over"} className="p-button-raised" />
                </div>
              </Dialog>
            </div>
            <div
              className="mt-3 mb-3 p-4 border-1 surface-border"
              style={{ borderRadius: '6px' }}
            >
              <h1 className="text-xl">Academic Session List</h1>
              <hr className="my-4" />
              <div className="w-full flex justify-content-end mb-4">
                <Button label="Create New Academic Session" icon={<FiPlusSquare className="mr-2" />} className="p-button-sm" onClick={() => setAcademicSessionSwitcherOpen(true)} />
              </div>
              <DataTable value={rowSession} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}  dataKey="id"
                removableSort size="small" scrollable scrollHeight="flex">
                <Column field="id" header="ID"></Column>
                <Column field="session" header="Session" sortable filter></Column>
                <Column field="start_year" header="Start Year" sortable filter></Column>
                <Column field="end_year" header="End Year" sortable filter></Column>
                <Column field="is_active" header="Status" body={sessionStatusBodyTemplate}></Column>
              </DataTable>
            </div>
            <div
              className="mt-4 border-1 surface-border p-4"
              style={{ borderRadius: '6px' }}
            >
              <h1 className="text-xl">Academic Terms List</h1>
              <hr className="my-4" />
              <div className="w-full flex justify-content-end mb-4">
                <Button label="Create New Academic Term" icon={<FiPlusSquare className="mr-2" />} className="p-button-sm" onClick={() => setAcademicTermSwitcherOpen(true)} />
              </div>
              <DataTable value={rowTerm} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}  dataKey="id"
                removableSort size="small" scrollable scrollHeight="flex">
                <Column field="id" header="ID"></Column>
                <Column field="term_name" header="Term Name" sortable filter></Column>
                <Column field="session" header="Session" sortable filter></Column>
                <Column field="is_active" header="Status" body={termStatusBodyTemplate}></Column>
              </DataTable>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="System Settings" style={{ width: "100%" }}>
          <div className="p-4 border-1 surface-border" style={{ borderRadius: '6px' }}>
            <h3 className="text-2xl mb-3 flex align-items-center">
              <FiSettings className="mr-2" /> System Settings
            </h3>
            <hr className="my-4" />
            <form onSubmit={handleSubmit}>
              <div className="formgrid grid">
                <div className="field col-12 md:col-6">
                  <label htmlFor="active_services" className="font-bold">Active Services</label>
                  <Dropdown
                    id="active_services"
                    name="active_services"
                    value={formData.active_services}
                    options={[
                      { value: "portal_website", label: "School Portal and Website" },
                      { value: "portal_only", label: "School Portal Only" },
                    ]}
                    onChange={(e) => handleChange({ target: { name: 'active_services', value: e.value, type: 'select' } })}
                    required
                  />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_name" className="font-bold">School Name</label>
                  <InputText id="school_name" name="school_name" value={formData.school_name} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_motto" className="font-bold">School Motto / Slogan / Tagline</label>
                  <InputText id="school_motto" name="school_motto" value={formData.school_motto} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="mission" className="font-bold">Our Mission</label>
                  <InputText id="mission" name="mission" value={formData.mission} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="principal" className="font-bold">Principal</label>
                  <InputText id="principal" name="principal_name" value={formData.principal_name} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="vision" className="font-bold">Our Vision</label>
                  <InputText id="vision" name="vision" value={formData.vision} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="core_values" className="font-bold">Our Core Values</label>
                  <InputText id="core_values" name="core_values" value={formData.core_values} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_email" className="font-bold">School Email</label>
                  <InputText id="school_email" name="school_email" value={formData.school_email} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_phone" className="font-bold">School Phone</label>
                  <InputText id="school_phone" name="school_phone" value={formData.school_phone} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="fees_support_contact" className="font-bold">Fees Payment Support Contact Desk</label>
                  <InputText id="fees_support_contact" name="fees_support_contact" value={formData.fees_support_contact} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_address" className="font-bold">School Address</label>
                  <InputText id="school_address" name="school_address" value={formData.school_address} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="country" className="font-bold">Country</label>
                  <InputText id="country" name="country" value={formData.country} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="city_state" className="font-bold">City/State</label>
                  <InputText id="city_state" name="city_state" value={formData.city_state} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="currency_symbol" className="font-bold">Currency Symbol</label>
                  <InputText id="currency_symbol" name="currency_symbol" value={formData.currency_symbol} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="school_website" className="font-bold">School Website</label>
                  <InputText id="school_website" name="school_website" value={formData.school_website} onChange={handleChange} />
                </div>
                <div className="field col-12 md:col-6 flex align-items-center">
                  <Checkbox
                    inputId="absence_sms_to_parent"
                    name="absence_sms_to_parent"
                    checked={formData.absence_sms_to_parent}
                    onChange={(e) => handleChange({
  target: {
    name: 'active_services',
    value: e.value,
    // Provide other properties as needed, or cast to unknown first
    // For a quick fix, you might need to broaden the type of handleChange or use `as any` (less safe)
  } as HTMLSelectElement
  // You'd also need to add nativeEvent, currentTarget, etc. if you were truly mimicking the ChangeEvent.
  // This is why Option 1 is generally better for this scenario.
})}
                  />
                  <label htmlFor="absence_sms_to_parent" className="ml-2 font-bold">Absence on Attendance SMS to Parent</label>
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="head_staff_title" className="font-bold">School Head staff title</label>
                  <InputText id="head_staff_title" name="head_staff_title" value={formData.head_staff_title} onChange={handleChange} />
                </div>
              </div>
              <div className="flex justify-content-center mt-4">
                <Button type="submit" label="Save" className="p-button-raised" />
              </div>
            </form>
          </div>
        </TabPanel>
        <TabPanel header="Image Settings" style={{ width: "100%" }}>
          <div className="card">
            <h2 className="text-2xl mb-3">Image Settings</h2>
            <hr className="my-4" />
            <div className="grid">
              <div className="col-12 md:col-4">
                <div className="flex flex-column align-items-center justify-content-center p-4 border-1 surface-border h-full" style={{ borderRadius: '6px' }}>
                  <h2 className="text-lg">School Logo</h2>
                  <img
                    src={imagePreview}
                    style={{ width: "200px", height: "200px", border: '1px solid #eaeaea', objectFit: 'contain' }}
                    alt="School Logo"
                    className="mb-3"
                  />
                  <div className="relative w-12rem">
                    <Button label="Select Image" className="p-button-outlined w-full" />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      // onChange handler for image upload
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="flex flex-column align-items-center justify-content-center p-4 border-1 surface-border h-full" style={{ borderRadius: '6px' }}>
                  <h3 className="text-lg">Additional Logo for Results</h3>
                  <img
                    src={imagePreview2}
                    style={{ width: "200px", height: "200px", border: '1px solid #eaeaea', objectFit: 'contain' }}
                    alt="Additional Logo"
                    className="mb-3"
                  />
                  <div className="relative w-12rem">
                    <Button label="Select Image" className="p-button-outlined w-full" />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      // onChange handler for image upload
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="flex flex-column align-items-center justify-content-center p-4 border-1 surface-border h-full" style={{ borderRadius: '6px' }}>
                  <h2 className="text-lg">Site Icon</h2>
                  <img
                    src={imagePreview3}
                    style={{ width: "200px", height: "200px", border: '1px solid #eaeaea', objectFit: 'contain' }}
                    alt="Site Icon"
                    className="mb-3"
                  />
                  <div className="relative w-12rem">
                    <Button label="Select Image" className="p-button-outlined w-full" />
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      // onChange handler for image upload
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Email" style={{ width: "100%" }}>
          <div className="card flex align-items-center justify-content-center h-full" style={{ minHeight: '400px' }}>
            <div className="flex flex-column align-items-center justify-content-center">
              <h1 className="text-5xl">404</h1>
              <h6 className="text-xl">Page Under Development</h6>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="SMS" style={{ width: "100%" }}>
          <div className="card flex align-items-center justify-content-center h-full" style={{ minHeight: '400px' }}>
            <div className="flex flex-column align-items-center justify-content-center">
              <h1 className="text-5xl">404</h1>
              <h6 className="text-xl">Page Under Development</h6>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="User Privileges" style={{ width: "100%" }}>
          <div className="card flex align-items-center justify-content-center h-full" style={{ minHeight: '400px' }}>
            <div className="flex flex-column align-items-center justify-content-center">
              <h1 className="text-5xl">404</h1>
              <h6 className="text-xl">Page Under Development</h6>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <Dialog
        header="Create New Academic Session"
        visible={academicSessionSwitcherOpen}
        onHide={() => setAcademicSessionSwitcherOpen(false)}
        modal
        className="p-fluid"
        style={{ width: '90vw', maxWidth: '700px' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <form onSubmit={handleNewSessionSubmit} className="formgrid grid">
          <div className="field col-12 md:col-4">
            <label htmlFor="start_year" className="font-bold">Start Year</label>
            <InputNumber inputId="start_year" value={academicSessionForm.start_year} onValueChange={(e) => setAcademicSessionForm({ ...academicSessionForm, start_year: e.value || 0 })} required />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="end_year" className="font-bold">End Year</label>
            <InputNumber inputId="end_year" value={academicSessionForm.end_year} onValueChange={(e) => setAcademicSessionForm({ ...academicSessionForm, end_year: e.value || 0 })} required />
          </div>
          <div className="field col-12 md:col-4">
            <label htmlFor="academic_year" className="font-bold">Academic Year</label>
            <InputNumber inputId="academic_year" value={academicSessionForm.academic_year} onValueChange={(e) => setAcademicSessionForm({ ...academicSessionForm, academic_year: e.value || 0 })} required />
          </div>
          <div className="field col-12 flex align-items-center">
            <Checkbox inputId="is_activesession" checked={academicSessionForm.is_active} onChange={(e) => setAcademicSessionForm({ ...academicSessionForm, is_active: e.checked || false })} />
            <label htmlFor="is_activesession" className="ml-2">Is Active</label>
          </div>
          <div className="col-12 flex justify-content-center pt-4">
            <Button type="submit" label={studentsManagementDetails.isLoading === true ? "...saving, please wait" : "Submit"} className="p-button-raised" />
          </div>
        </form>
      </Dialog>

      <Dialog
        header="Create New Academic Term"
        visible={academicTermSwitcherOpen}
        onHide={() => setAcademicTermSwitcherOpen(false)}
        modal
        className="p-fluid"
        style={{ width: '90vw', maxWidth: '700px' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <form onSubmit={handleAcademicTermSubmit} className="formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="term_name" className="font-bold">Term Name</label>
            <InputText id="term_name" value={academicTermForm.term_name} onChange={(e) => setAcademicTermForm({ ...academicTermForm, term_name: e.target.value })} required />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="academicsession_term" className="font-bold">Academic Session</label>
            <Dropdown
              id="academicsession_term"
              value={academicTermForm.session}
              options={fetchedSessions}
              onChange={(e) => setAcademicTermForm({ ...academicTermForm, session: e.value })}
              placeholder="Select Session"
              required
            />
          </div>
          <div className="field col-12 flex align-items-center">
            <Checkbox inputId="is_active_term" checked={academicTermForm.is_active} onChange={(e) => setAcademicTermForm({ ...academicTermForm, is_active: e.checked || false })} />
            <label htmlFor="is_active_term" className="ml-2">Is Active</label>
          </div>
          <div className="col-12 flex justify-content-center pt-4">
            <Button type="submit" label={studentsManagementDetails.isLoading === true ? "...saving, please wait" : "Submit"} className="p-button-raised" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default SystemSettings;