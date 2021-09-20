import LoadingIndicator from "@components/LoadingIndicator";
import React from "react";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import { css } from "@emotion/react";
import tw from "twin.macro";

import { Link } from "gatsby";
import formatDate from "@utils/formatDate";
import { useTransfers } from "@api/useTransfers";
import { FormattedMessage } from "react-intl";
import TransferStatusBadge from "@components/TransferStatusBadge";

import { useEdition } from "@api/useItems";
import Truncate from "@components/Truncate";
import formatMintNumber from "@utils/formatMintNumber";

export default function Transfers() {
  const transfers = useTransfers();

  return (
    <ProfileSubPagesLayout>
      <LoadingIndicator robot isLoading={transfers.isLoading} />
      <div
        className="mb-12 "
        css={css`
          .grid-template {
            ${tw`grid`}
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas: "id  date " "name status  " "network wallet";
            .name {
              grid-area: name;
              min-width: 0;
            }
            .id {
              grid-area: id;
              min-width: 0;
            }
            .wallet {
              grid-area: wallet;
              min-width: 0;
            }
            .date {
              grid-area: date;
              min-width: 0;
            }
            .network {
              grid-area: network;
              min-width: 0;
            }
            .status {
              grid-area: status;
              min-width: 0;
            }

            @media (min-width: 768px) {
              grid-template-columns: repeat(3, 1fr);
              grid-template-areas: "id name date " "network wallet status";
            }
            @media (min-width: 1024px) {
              grid-template-columns: 1fr 2fr 4fr 3fr 3fr 3fr;
              grid-template-areas: "id date name wallet network status";
            }

            span {
              ${tw`p-4 tablet:py-1`}
            }
          }
        `}
      >
        {transfers?.data?.length === 0 && (
          <p>You haven’t transfered anything yet.</p>
        )}
        {transfers?.data?.length > 0 && (
          <div className="grid-template bg-primary-dark  tablet:!hidden">
            <span className="date">
              <FormattedMessage id="date" />
            </span>
            <span className="id">ID</span>
            <span className="name">
              <FormattedMessage id="cart.item" /> (
              <FormattedMessage id="orders.mint" />)
            </span>
            <span className="wallet">Wallet</span>
            <span className="network">Network</span>
            <span className="status">
              <FormattedMessage id="orders.status" />
            </span>
          </div>
        )}
        {transfers?.data
          ?.sort((a, b) => {
            return parseInt(b.id) - parseInt(a.id);
          })
          ?.map((transfer) => {
            return <TableRow key={transfer.id} transfer={transfer} />;
          })}
      </div>
    </ProfileSubPagesLayout>
  );
}

function TableRow({ transfer }) {
  const { edition } = useEdition(transfer.edition_id);
  return (
    <Link
      to={`/marketplace/profile/transfers/${transfer.id}`}
      className="py-2 border-t border-white grid-template border-opacity-20 hover:bg-primary hover:bg-opacity-20"
    >
      <span className="id">
        <div className="text-xs font-bold lg:hidden opacity-60">ID</div>
        {transfer.id}
      </span>
      <span className="date">
        <div className="text-xs font-bold lg:hidden opacity-60">
          <FormattedMessage id="date" />
        </div>
        {formatDate(transfer.createdAt)}
      </span>
      <span className={"capitalize name"}>
        <div className="text-xs font-bold lg:hidden opacity-60">
          <FormattedMessage id="name" />
        </div>
        <strong className="block font-semibold">
          {edition?.edition_name}{" "}
          <span className="opacity-80">
            ({formatMintNumber(transfer?.item_id)})
          </span>
        </strong>
      </span>
      <span className={"capitalize wallet"}>
        {" "}
        <div className="text-xs font-bold lg:hidden opacity-60">Wallet</div>
        <Truncate text={transfer.receiver} />
      </span>
      <span className={"capitalize network"}>
        {" "}
        <div className="text-xs font-bold lg:hidden opacity-60">Network</div>
        {transfer.network}
      </span>
      <span className={"capitalize status"}>
        <div className="mb-1 text-xs font-bold lg:hidden opacity-60">
          Status:
        </div>
        <TransferStatusBadge status={transfer.status} />
      </span>
    </Link>
  );
}
