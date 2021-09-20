import useAllEditions, { useEdition } from "@api/useItems";

import React, { useContext, useEffect, useState } from "react";

import { css } from "@emotion/react";
import { Dialog } from "@headlessui/react";
import {
  useAuction,
  useAuctionBids,
  useSubmitBidOnAuction,
} from "@api/useAuction";
import LoadingIndicator from "@components/LoadingIndicator";
import BidWallet from "@icons/bid-wallet";
import useAuth, { useToken } from "@api/useAuth";
import { useQueryClient } from "react-query";
import { Form, InputPrice, ErrorMessage } from "./Form";
import { isBefore } from "date-fns";
import Modal from "./Modal";
import { useFormContext } from "react-hook-form";
import DescriptionCollapse from "./DescriptionCollapse";
import Scrollbar from "./Scrollbar";
import useWeb3Modal from "@utils/web3modal";
import auctionUtils from "@utils/auctionUtils";
import formatPrice from "@utils/formatPrice";
import formatMintNumber from "@utils/formatMintNumber";
import { isMetamaskInstalled } from "@api/useWeb3";
import useCookies from "@api/useCookies";
import Countdown from "./Countdown";

const BidMutationContext = React.createContext({});

export const Bid = ({ children }) => {
  const bidOnItem = useSubmitBidOnAuction();
  return (
    <BidMutationContext.Provider value={bidOnItem}>
      {children}
    </BidMutationContext.Provider>
  );
};

const useBidAction = () => {
  return useContext(BidMutationContext);
};

export function BidError() {
  const mutation = useBidAction();
  return mutation.error ? (
    <div className="mt-2 text-sm font-semibold text-red">
      {mutation.error?.message || mutation.error?.stack || mutation.error}
    </div>
  ) : null;
}

export default function BidButton({
  buyNow,
  edition_id,
  auctionId,
  children,
  ...rest
}) {
  const { setCookie, getCookie } = useCookies();
  const buyerMetamaskMessage = getCookie("bidder-metamask-message");
  const { user } = useAuth();
  const { onConnect, conState } = useWeb3Modal();

  const [isOpen, setIsOpen] = useState(false);
  const { data: auction } = useAuction(auctionId);
  const [metamaskModal, setMetamaskModal] = useState(false);
  function isUsersAuction() {
    return auction?.user_id == user?.user_id;
  }
  function userHasBuyNowBId() {
    return (
      auction?.winning_bid?.bidder_id == user?.user_id &&
      (auction?.winning_bid?.buy_now_status == "waiting" ||
        auction?.winning_bid?.buy_now_status == "processing")
    );
  }
  const Button = buyNow ? BuyNowButton : "button";

  async function openBidModal() {
    setCookie("bidder-metamask-message", true, {
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 30 * 365,
    });

    let { address, web3 } = conState;

    if (!address || !web3) {
      const res = await onConnect();

      address = res.address;
      web3 = res.web3;
    }
    setIsOpen(true);
  }

  console.log(auction);

  return (
    <Bid>
      <Countdown date={auction?.end_at}>
        {() => {
          const stage = auctionUtils.getStage(auction);
          return (
            <Button
              buyNow={buyNow}
              {...rest}
              auctionId={auctionId}
              disabled={
                !auction ||
                isUsersAuction() ||
                stage != "ongoing" ||
                userHasBuyNowBId()
              }
              onClick={async () => {
                if (!isMetamaskInstalled) {
                  setMetamaskModal(true);
                  return;
                }
                if (!buyerMetamaskMessage) {
                  setMetamaskModal(true);
                } else {
                  openBidModal();
                }
              }}
            >
              {children || "Bid"}
            </Button>
          );
        }}
      </Countdown>
      <PlaceBidModal
        edition_id={edition_id}
        auctionId={auctionId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <MetamaskConsentModal
        onClose={openBidModal}
        isOpen={metamaskModal}
        setIsOpen={setMetamaskModal}
      />
    </Bid>
  );
}
function BuyNowButton({ buyNow, onClick, auctionId, ...rest }) {
  const bidOnItem = useBidAction();
  const { conState } = useWeb3Modal();
  return (
    <button
      {...rest}
      onClick={() => {
        bidOnItem.mutate({
          auction_id: auctionId,
          bid_price: buyNow,
          web3: conState.web3,
          address: conState.address,
        });
      }}
    >
      {"Buy now"}
      <LoadingIndicator
        isLoading={bidOnItem.isLoading}
        className="ml-2"
      ></LoadingIndicator>
    </button>
  );
}

function MetamaskConsentModal({ isOpen, setIsOpen, onClose }) {
  return (
    <Modal {...{ isOpen, setIsOpen }}>
      <h2 className="mb-2 text-2xl">Metamask Wallet required!</h2>
      <p>
        Bids are in US Dollars, but winning bidders must pay in ETH. Please link
        your Metamask wallet so you can pay in ETH if you are the winner. No ETH
        will be collected until you claim the item after you win, but you must
        have enough ETH in your wallet to cover your bid.
      </p>
      <button
        className="mt-4 "
        onClick={() => {
          setIsOpen(false);
          onClose();
        }}
      >
        I understand
      </button>
    </Modal>
  );
}

function PlaceBidModal({ auctionId, edition_id, isOpen, setIsOpen }) {
  const bidOnItem = useBidAction();
  const { data: user } = useAuth();
  const { conState, onConnect } = useWeb3Modal();

  const auction = useAuction(auctionId);
  const bids = useAuctionBids(auctionId);
  const { edition } = useEdition(edition_id);
  useEffect(() => {
    if (bidOnItem.isSuccess) {
      setIsOpen(false);
    }
  }, [bidOnItem.isSuccess]);

  const highestBid = bids?.data
    ?.map((b) => parseFloat(b.bid_price))
    ?.sort((a, b) => {
      return b - a;
    })?.[0];
  const minBid = Math.max(
    highestBid ?? 0,
    parseFloat(auction?.data?.min_price)
  );

  function minAmount() {
    let minimum_increase = 0;
    if (bids?.data?.length > 0) {
      minimum_increase = 0.05;
      if (minBid >= 5000) {
        minimum_increase = 100;
      } else if (minBid >= 2500) {
        minimum_increase = 50;
      } else if (minBid >= 1000) {
        minimum_increase = 25;
      } else if (minBid >= 500) {
        minimum_increase = 10;
      } else if (minBid >= 250) {
        minimum_increase = 5;
      } else if (minBid >= 100) {
        minimum_increase = 2.5;
      } else if (minBid >= 25) {
        minimum_increase = 1;
      } else if (minBid >= 5) {
        minimum_increase = 0.5;
      } else if (minBid >= 1) {
        minimum_increase = 0.25;
      }

      return minBid + minimum_increase;
    }

    return minBid;
  }
  return (
    <Modal {...{ isOpen, setIsOpen }}>
      <Scrollbar className="max-h-[90vh] -mr-4 pr-4">
        <h3 className="mb-3 text-2xl">
          {edition?.edition_name} <br />{" "}
          <span className="text-base text-yellow/70">
            Mint #{formatMintNumber(auction?.data?.item_id)} of{" "}
            {edition.total_minted}
          </span>{" "}
          <span className="text-base text-yellow/70">
            / Owner:{" "}
            {auction?.data?.user_name != ""
              ? auction?.data?.user_name
              : `User #${auction?.data?.user_id?.slice(0.6)}`}
          </span>
          <LoadingIndicator isLoading={bids.isLoading} />
        </h3>
        <div></div>
        <Form
          onSubmit={async ({ bid_price }) => {
            let { address, web3 } = conState;

            // console.log('address', address);
            // console.log('web3', web3);

            if (!address || !web3) {
              const res = await onConnect();

              address = res.address;
              web3 = res.web3;
            }
            bidOnItem.mutate({
              auction_id: auctionId,
              bid_price,
              web3,
              address,
            });
          }}
          className="grid gap-y-2 grid-cols-[minmax(0px,3fr),1fr] mt-4"
        >
          <div className="flex items-center px-2 bg-white">
            <div className="px-2 text-2xl font-bold text-primary">$</div>
            <InputPrice
              name="bid_price"
              required
              className="flex-grow"
              options={{
                min: {
                  value: minAmount(),
                  message: !auction?.data?.silent_auction
                    ? `Minimum bid for this item is $${minAmount().toFixed(2)}`
                    : `Bid is below your previous bid of ${formatPrice(
                        highestBid
                      )}. Minimum bid is ${minAmount().toFixed(2)}`,
                },
              }}
              placeholder={"Min. bid: " + formatPrice(minAmount().toFixed(2))}
            />
          </div>
          <BidLabel bidOnItem={bidOnItem} min={minAmount()} auction={auction} />
          <ErrorMessage name="bid_price" />
        </Form>
        <BidError />
      </Scrollbar>
    </Modal>
  );
}

function BidLabel({ bidOnItem }) {
  return (
    <button type="submit" className="space-x-2" disabled={bidOnItem.isLoading}>
      <>
        <BidWallet />
        <span>Bid</span>{" "}
      </>
      <LoadingIndicator isLoading={bidOnItem.isLoading}></LoadingIndicator>
    </button>
  );
}
