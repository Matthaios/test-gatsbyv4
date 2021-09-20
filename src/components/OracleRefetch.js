import { useOracle } from "@api/useOracle";
import React, { useEffect } from "react";

export default function OracleRefetch() {
  const query = useOracle();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const int = setInterval(() => {
        query?.refetch();
      }, 30 * 1000);
      return () => {
        clearInterval(int);
      };
    }
  }, []);
  return null;
}
