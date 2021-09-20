import useAuth, { useToken } from "@api/useAuth";
import { navigate } from "gatsby-link";
import React from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function ProtectedComponent({ children, redirect }) {
  const query = useAuth();
  const tokenQuery = useToken();

  if (
    !tokenQuery?.data?.token &&
    !query.isLoading &&
    !tokenQuery.isLoading &&
    !query.data
  ) {
    typeof window !== "undefined" &&
      navigate(`/marketplace/login?redirect=${redirect}`);
    return null;
  }
  if (query.isLoading || tokenQuery.isLoading) {
    return <LoadingIndicator isLoading={true} robot />;
  }
  if (!query.isLoading && query.data) {
    return children;
  } else {
    return null;
  }
}
