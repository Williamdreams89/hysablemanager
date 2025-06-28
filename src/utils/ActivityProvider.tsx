import React, { createContext, useContext, useState, useEffect } from "react";

const ActivityContext = createContext<{ resetTimer: () => void }>({
  resetTimer: () => {},
});

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inactiveTime, setInactiveTime] = useState(0);

  useEffect(() => {
    const handleActivity = () => setInactiveTime(0);

    const interval = setInterval(() => {
      setInactiveTime((time) => time + 1);
    }, 1000);

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
    };
  }, []);

  useEffect(() => {
    if (inactiveTime >= 30 * 60) {
      window.location.href = "/lock-screen";
    }
  }, [inactiveTime]);

  return (
    <ActivityContext.Provider value={{ resetTimer: () => setInactiveTime(0) }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
