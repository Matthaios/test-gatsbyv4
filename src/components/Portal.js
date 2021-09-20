import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const modalRoot = typeof window !== "undefined" && document.body;

const Portal = ({ children }) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current =
      typeof window != "undefined" && document.createElement("div");
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      modalRoot.appendChild(elRef.current);
      return () => modalRoot.removeChild(elRef.current);
    }
  }, []);
  if (typeof window === "undefined") {
    return null;
  }
  return createPortal(<div>{children}</div>, elRef.current);
};
export default Portal;
