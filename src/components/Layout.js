import React from "react";
import CookieConsent from "./CookieConsent";
import Footer from "./Footer";
import Header from "./Header";
import Topbar from "./Topbar";
import UnlockedItemNotification from "./UnlockedItemNotification";

export default function Layout({ children, ...rest }) {
  return (
    <div
      className="relative flex flex-col items-stretch min-h-screen"
      {...rest}
    >
      <Topbar />
      <Header />
      <div className="flex flex-col items-stretch flex-grow w-full bg-pattern ">
        <main className="flex-grow min-h-full main-layout">{children}</main>
      </div>
      <Footer />
      {typeof window !== "undefined" && <CookieConsent />}
      <UnlockedItemNotification />
    </div>
  );
}
