import { useEffect } from "react";

const useInactivityTracker = (
  timeout: number,
  onInactive: () => void,
  isPaused: boolean
) => {
  useEffect(() => {
    if (isPaused) return; // Stop tracking when paused

    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onInactive, timeout * 1000);
    };

    const handleActivity = () => resetTimer();

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Start the timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [timeout, onInactive, isPaused]);
};

export default useInactivityTracker;
