import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";
import { ReactQueryDevtools } from "react-query/devtools";
import { NotificationsProvider } from "@utils/notifications";
import AblyProvider from "@api/ably";
import MetamaskWarning from "@components/MetamaskWarning";
import { IntlProvider } from "react-intl";
import enTranslation from "../translations/en.json";
import OracleRefetch from "./OracleRefetch";
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError: true,
    },
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
export default function RootElement({ children }) {
  return (
    <IntlProvider messages={enTranslation} locale="en" defaultLocale="en">
      <CookiesProvider>
        {/* <Web3 /> */}
        <QueryClientProvider client={queryClient}>
          <AblyProvider>
            {children} <ReactQueryDevtools initialIsOpen={false} />
            <NotificationsProvider />
          </AblyProvider>
          <MetamaskWarning />
          <OracleRefetch />
        </QueryClientProvider>
      </CookiesProvider>
    </IntlProvider>
  );
}
