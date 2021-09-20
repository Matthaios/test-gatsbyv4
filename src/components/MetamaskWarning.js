import React from "react";
import { useQuery } from "react-query";

export default function MetamaskWarning() {
  const query = useQuery("metamask-warning", () => {
    return false;
  });
  if (query?.data) {
    return <Warning />;
  } else {
    return null;
  }
}

function Warning() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black/80 z-[9000] flex items-center justify-center">
      <div className="prose-lg ">
        <div className="font-semibold text-yellow">
          You must confirm or reject the Metamask transaction before refreshing
          or closing this page.
        </div>
      </div>
    </div>
  );
}
