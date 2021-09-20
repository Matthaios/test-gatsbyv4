import { useTransfers } from "@api/useTransfers";
import EditionCard from "@components/EditionCard";
import LoadingIndicator from "@components/LoadingIndicator";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import TransferTimeline from "@components/TransferTimeline";
import React from "react";

export default function Transfer({ params }) {
  const transfer = useTransfers((d) => d.find((t) => t.id == params.id));

  if (transfer?.isLoading) {
    return (
      <ProfileSubPagesLayout>
        {" "}
        <LoadingIndicator robot isLoading={true} />
      </ProfileSubPagesLayout>
    );
  }
  return (
    <ProfileSubPagesLayout>
      <div className="container py-10">
        <div className="mx-auto prose text-center">
          <h1>Transfer ID: {transfer.data?.id} details</h1>
        </div>
        <div className="mt-12">
          <div className="row md:cols-1/2 row-x-8">
            <div>
              {" "}
              {transfer.data?.edition_id && (
                <div>
                  {" "}
                  <EditionCard.Image
                    edition_id={transfer.data?.edition_id}
                    item_id={transfer.data?.item_id}
                  />
                </div>
              )}
            </div>
            <div>
              {transfer.data?.edition_id && (
                <EditionCard.Details
                  className="mt-4 mb-8"
                  edition_id={transfer.data?.edition_id}
                  item_id={transfer.data?.item_id}
                />
              )}
              <h2 className="mb-8 text-2xl">Transfer details:</h2>
              {transfer?.data && <TransferTimeline transfer={transfer.data} />}
            </div>
          </div>
        </div>
      </div>
    </ProfileSubPagesLayout>
  );
}
