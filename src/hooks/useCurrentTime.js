import { convertJstDate } from "../utils/dateUtils";

import { useState, useEffect } from "react";

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return convertJstDate(now);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(convertJstDate(now));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return currentTime;
};

export default useCurrentTime;
