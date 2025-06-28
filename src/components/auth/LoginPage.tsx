import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import useMediaQuery  from "@mui/material/useMediaQuery";
import axiosInstance from '../../utils/axiosInstance';
import { APIContext } from "../../utils/contexts/ReactContext";
import { getCachedAuth, getCachedData, saveAuthToCache, saveDataToCache } from "../../utils/indexedDB";

const LoginPage = () => {
  const toast = useRef<Toast>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [systemSettingsData, setSystemSettingsData] = useState([]);

  const navigate = useNavigate();
  const context = useContext(APIContext);
  if (!context) throw new Error("There is no context");
  const { setStudentsManagementDetails } = context;

  const isSmallDevice = useMediaQuery('(max-width:1045px)');

  useEffect(() => {
    const fetchSystemSettingsData = async () => {
      setStudentsManagementDetails(prev => ({ ...prev, isLoading: true }));

      try {
        if (!navigator.onLine) {
          const cachedData = await getCachedData("system-settings");
          if (cachedData) {
            setSystemSettingsData(cachedData);
            setStudentsManagementDetails(prev => ({
              ...prev,
              fetchedSystemSettings: cachedData,
              isLoading: false,
            }));
            return;
          } else {
            toast.current?.show({
              severity: 'info',
              summary: 'Offline',
              detail: 'No cached settings found.',
              life: 3000,
            });
          }
        }

        const { data } = await axiosInstance.get(`/api/system-settings/`);
        setSystemSettingsData(data);
        setStudentsManagementDetails(prev => ({
          ...prev,
          fetchedSystemSettings: data,
          isLoading: false,
        }));
        await saveDataToCache("system-settings", data);
        localStorage.setItem("school_name", `${data[0]?.school_name}`);

      } catch (error) {
        alert(`Error fetching system settings: ${error}`);
      } finally {
        setStudentsManagementDetails(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchSystemSettingsData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!navigator.onLine) {
        const cachedAuth = await getCachedAuth();
        if (cachedAuth && cachedAuth.email === email && cachedAuth.password === password) {
          localStorage.setItem("access_token", cachedAuth.token);
          localStorage.setItem("username", cachedAuth.username);
          localStorage.setItem("user_profile_pic", cachedAuth.user_profile_pic);
          localStorage.setItem("user_id", cachedAuth.user_id);
          navigate("/");
          return;
        } else {
          setError("No internet and no cached login found.");
          return;
        }
      }

      const response = await axiosInstance.post("/users/login/", { email, password });
      const { tokens, username, user_profile_pic, user_role, user_id } = response.data;

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("user_profile_pic", user_profile_pic);
      localStorage.setItem("user_role", user_role);
      localStorage.setItem("user_id", user_id);

      await saveAuthToCache({ email, password, tokens, username, user_profile_pic });

      navigate("/");

    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', width:'100vw', height:'100vh', alignItems:'center', justifyContent:'center'}}>
      <Toast ref={toast} />
      <div style={{display: 'flex', width:'100vw', height:'100%', alignItems:'center', justifyContent:'center'}} >
        <Card title="Admin Login" style={{width: !isSmallDevice?"30%": "98%"}}>
          <form onSubmit={handleLogin} className="p-fluid">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
              <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask required className="w-full" />
            </div>
            <div className="flex align-items-center mb-3">
              <Checkbox checked inputId="keepLoggedIn" className="mr-2" />
              <label htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <Button type="submit" label={loading ? "Signing In..." : "Sign In"} icon={loading ? "pi pi-spin pi-spinner" : undefined} className="w-full" disabled={loading} />
            <Divider className="my-4" />
            <div className="flex justify-between text-sm">
              <a href="/auth/forgot-password">Forgot Password?</a>
              <a href="#">Don't have an account?</a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
