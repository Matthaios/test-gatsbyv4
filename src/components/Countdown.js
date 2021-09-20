import React, { useEffect, useRef, useState } from "react";
import differenceInSeconds from "date-fns/differenceInSeconds";

export default function Countdown({ date, minutesOnly, children }) {
  const ended = useRef(false);
  const lockAuction = useRef(false);
  function formatTime() {
    const ONE_DAY = 60 * 60 * 24;
    const ONE_HOUR = 60 * 60;
    const ONE_MINUTE = 60;

    const end = new Date(date);
    const diffInSeconds = differenceInSeconds(end, new Date());

    if (diffInSeconds < 1) {
      ended.current = true;
      lockAuction.current = true;
      return "Ended";
    } else {
      const days = Math.floor(diffInSeconds / ONE_DAY);
      const hours = Math.floor((diffInSeconds - days * ONE_DAY) / ONE_HOUR);
      const minutes = Math.floor(
        (diffInSeconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE
      );
      if (diffInSeconds / 60 < 5) {
        lockAuction.current = true;
      }
      const seconds =
        diffInSeconds -
        days * ONE_DAY -
        hours * ONE_HOUR -
        minutes * ONE_MINUTE;

      if (minutesOnly) {
        return `${minutes} min : ${seconds} sec`;
      }
      if (days > 0) {
        return `Ends in ${days} day${days > 1 ? "s" : ""}`;
      } else {
        return `${days ? days : ""}${
          days ? " d : " : ""
        }${hours} h : ${minutes} m : ${seconds} s`;
      }
    }
  }
  const [time, setTime] = useState(formatTime());
  React.useEffect(() => {
    if (typeof window == "undefined") {
      return;
    }
    var interval = null;
    if (typeof window !== "undefined") {
      interval = setInterval(() => {
        setTime(formatTime());
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [date]);
  return children(time, ended.current, lockAuction.current);
}
