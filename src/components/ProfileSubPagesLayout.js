import React from "react";
import { css } from "@emotion/react";
import Layout from "@components/Layout";
import ProtectedComponent from "@components/ProtectedComponent";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import Breadcrumbs from "@components/Breadcrumbs";

export default function ProfileSubPagesLayout({ children, breadcrumbs }) {
  const location = useLocation();
  return (
    <Layout>
      <ProtectedComponent redirect={location.pathname}>
        <div className="hero-spacer"></div>
        <div className="container pt-8 pb-16 ">
          <Breadcrumbs
            paths={[
              {
                to: "/marketplace/profile",
                label: "Profile",
              },
            ]}
            label={(() => {
              if (location.pathname.includes("orders")) {
                return breadcrumbs?.label ?? "Orders";
              }
              if (location.pathname.includes("items")) {
                return breadcrumbs?.label ?? "Items";
              }
              if (location.pathname.includes("collections")) {
                return breadcrumbs?.label ?? "Collections";
              }
              if (location.pathname.includes("auctions")) {
                return breadcrumbs?.label ?? "Auctions";
              }
              if (location.pathname.includes("transfers")) {
                return breadcrumbs?.label ?? "Transfers";
              }
            })()}
          />
          <div className="my-8 print:hidden ">
            <div
              css={css`
                > * {
                  margin-right: 1.25rem;
                }
              `}
            >
              <Link
                to="/marketplace/profile/items"
                partiallyActive={true}
                activeClassName="border-primary  border-b-4"
                className="inline-block pb-2 mb-6 font-semibold md:text-xl"
              >
                Items
              </Link>
              <Link
                to="/marketplace/profile/orders"
                partiallyActive={true}
                activeClassName="border-primary  border-b-4"
                className="inline-block pb-2 mb-6 font-semibold md:text-xl"
              >
                Order History
              </Link>
              <Link
                to="/marketplace/profile/collections"
                partiallyActive={true}
                activeClassName="border-primary  border-b-4"
                className="inline-block pb-2 mb-6 font-semibold md:text-xl"
              >
                Collections
              </Link>
              <Link
                to="/marketplace/profile/auctions"
                partiallyActive={true}
                activeClassName="border-primary  border-b-4"
                className="inline-block pb-2 mb-6 font-semibold md:text-xl"
              >
                Auctions
              </Link>
              <Link
                to="/marketplace/profile/transfers"
                partiallyActive={true}
                activeClassName="border-primary  border-b-4"
                className="inline-block pb-2 mb-6 font-semibold md:text-xl"
              >
                Transfers
              </Link>
            </div>
          </div>
          {children}
        </div>
      </ProtectedComponent>
    </Layout>
  );
}
