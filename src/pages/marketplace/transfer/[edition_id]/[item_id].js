import { usePurchases } from "@api/useProfile";
import { useTransferDetails } from "@api/useTransfers";
import EditionCard from "@components/EditionCard";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import { Link } from "gatsby";
import React, { useEffect } from "react";

export default function Success({ params }) {
  const { isLoading, data: item } = usePurchases((p) =>
    p.purchases.find(
      (i) => i.item_id == params.item_id && i.edition_id == params.edition_id
    )
  );

  const transfer = useTransferDetails(params.edition_id, params.item_id);
  useEffect(() => {}, [isLoading, Boolean(item)]);
  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="container py-20">
        <div className="mx-auto prose text-center">
          {transfer.data ? (
            !transfer.data.transaction_hash ? (
              <h1>Transfer in progress</h1>
            ) : (
              <h1>Transfer finished</h1>
            )
          ) : (
            <h1>Loading ...</h1>
          )}
        </div>
        <div className="mt-12 row cols-1/2 row-x-8">
          <div>
            <EditionCard.Image
              edition_id={params.edition_id}
              item_id={params.item_id}
            />
          </div>

          <div>
            <EditionCard.Details
              edition_id={params.edition_id}
              item_id={params.item_id}
            />
            {!transfer?.data?.transaction_hash && item?.is_locked && (
              <div className="mt-8 text-xl font-semibold text-green">
                <span>Item is transfering out</span>{" "}
                <LoadingIndicator
                  isLoading
                  className="inline-block ml-2 text-green"
                />
              </div>
            )}

            {transfer.data && transfer.data.transaction_hash && (
              <div className="mt-8 text-xl font-semibold text-green">
                <span>Item transfered out!</span>
                <div className="mt-4">
                  <Link
                    to={`/marketplace/profile/transfers/${transfer?.data?.id}`}
                    className="button"
                  >
                    Transfer page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
