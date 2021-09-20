import useAuth from "@api/useAuth";
import { useOracle } from "@api/useOracle";
import BigNumber from "bignumber.js";
import { Trophy } from "@components/Trophy";
import LoadingIndicator from "@components/LoadingIndicator";
import formatPrice, { usdToEth } from "@utils/formatPrice";
import React, { useCallback } from "react";
import Countdown from "./Countdown";
import { isMetamaskInstalled } from "@api/useWeb3";
import useWeb3Modal from "@utils/web3modal";
import { useMetamask } from "@api/useCart";
import { useMutation, useQueryClient } from "react-query";
import { useAuctions } from "@api/useProfile";
import SpeedUpAuction from "./SpeedUpAuction";
import debounce from "lodash/debounce";
export default function AuctionWinnerNotification({ auction }) {
  const { user } = useAuth((data) => data.user);
  const { bids } = useAuctions();
  if (auction?.buy_now_pending) {
    return null;
  }
  return auction?.completed &&
    auction?.winner &&
    !auction?.winning_bid?.expired &&
    !auction?.purchase_id ? (
    <>
      {auction && user?.user_id == auction?.winning_bid?.bidder_id ? (
        <div className="font-semibold">
          <div className="px-6 py-10 space-y-2 text-xl text-center bg-primary-dark">
            <Trophy className="w-20 h-20" />
            <h2 className="">
              Congratulations{" "}
              <strong className="!text-green">
                {(function () {
                  let name =
                    auction?.winner?.first_name +
                    " " +
                    auction?.winner?.last_name;
                  if (name.trim() === "") {
                    name = "User " + auction.winner?.user_id?.slice(0, 6);
                  }
                  return name;
                })()}
              </strong>
              !
            </h2>

            <p>
              <strong className="!text-green ">
                You placed a winning bid for this auction.
              </strong>
            </p>
            {auction?.winning_bid &&
            parseFloat(auction.winning_bid?.eth_amount) > 0 ? (
              <div className="!mt-4">
                <p>Transaction in progress ...</p>
              </div>
            ) : (
              <Countdown date={auction.winning_bid?.deadline}>
                {(time, ended) => (
                  <>
                    {" "}
                    <p>
                      {!ended ? (
                        <span className="!text-green ">
                          {" "}
                          You have {time} to buy this item.
                        </span>
                      ) : (
                        <span className="text-red">
                          Your time to buy this item has expired!
                        </span>
                      )}
                    </p>
                    {!ended && (
                      <>
                        {" "}
                        <p className="!mt-4">
                          <AuctionBuyNowButton auction={auction} />
                        </p>
                        {process.env.GATSBY_NETWORKS == "test" && (
                          <SpeedUpAuction auction_id={auction.id} />
                        )}
                      </>
                    )}
                  </>
                )}
              </Countdown>
            )}
          </div>
        </div>
      ) : (
        <div className="px-6 py-10 space-y-2 font-semibold text-center bg-primary-dark">
          <Trophy className="w-12 h-12" />
          <h2 className="text-xl">
            Winner:{" "}
            <strong className="!text-green">
              {(function () {
                let name =
                  auction?.winner?.first_name +
                  " " +
                  auction?.winner?.last_name;
                if (name.trim() === "") {
                  name = "User " + auction.winner?.user_id?.slice(0, 6);
                }
                return name;
              })()}
            </strong>{" "}
          </h2>

          <p>
            <strong className="!text-green ">Winning bid:</strong>{" "}
            {formatPrice(auction.winning_bid?.bid_price)}
          </p>

          {parseFloat(auction.winning_bid?.eth_amount) > 0 && (
            <div className="!mt-4">
              <p>Transaction in progress ...</p>
            </div>
          )}

          {parseFloat(auction.winning_bid?.eth_amount) == 0 && (
            <>
              {" "}
              <p>
                <Countdown date={auction.winning_bid?.deadline}>
                  {(time, ended) =>
                    ended ? (
                      <span className="text-yellow">Processing...</span>
                    ) : (
                      <>
                        {" "}
                        <strong className="!text-green  ">
                          {" "}
                          Time to buy:
                        </strong>{" "}
                        <span>{time}</span>
                      </>
                    )
                  }
                </Countdown>
              </p>
              {process.env.GATSBY_NETWORKS == "test" && (
                <Countdown date={auction.winning_bid?.deadline}>
                  {(time, ended) =>
                    ended ? null : <SpeedUpAuction auction_id={auction.id} />
                  }
                </Countdown>
              )}
            </>
          )}
        </div>
      )}
    </>
  ) : auction?.succeed && auction?.purchase_id ? (
    <div className="px-6 py-10 space-y-2 font-semibold text-center bg-primary-dark">
      <Trophy className="w-12 h-12" />
      <h2 className="text-xl">
        Winner:{" "}
        <strong className="!text-green">
          {(function () {
            let name =
              auction?.winner?.first_name + " " + auction?.winner?.last_name;
            if (name.trim() === "") {
              name = "User " + auction.winner?.user_id?.slice(0, 6);
            }
            return name;
          })()}
        </strong>{" "}
      </h2>
      <p>
        User purchased item for {formatPrice(auction.winning_bid?.bid_price)}
      </p>
    </div>
  ) : null;
}
export function AuctionBuyNowButton({ auction }) {
  const oracle = useOracle();
  const { user } = useAuth((data) => data.user);
  const { onConnect, conState } = useWeb3Modal();
  const metamask = useMetamask();

  const purchase = useMutation(async ({ conState, auction }) => {
    var { web3, address } = conState;
    if (!web3 || !address) {
      const res = await onConnect();
      web3 = res.web3;
      address = res.address;
      if (!address || !web3) {
        throw Error("You need to connect Metamask");
      }
    }

    await oracle.refetch();

    await metamask.mutateAsync({
      web3,
      account: address,
      userId: user.user_id,
      cartData: [
        {
          edition_id: auction.edition_id,
          item_id: auction.item_id,
          address: auction.address,
        },
      ],
      total: new BigNumber(auction.winning_bid?.bid_price).dividedBy(
        new BigNumber(oracle?.data?.price)
      ),
      totalUSD: [auction.winning_bid?.bid_price],
      isAuction: true,
      auction_id: auction.id,
    });
    return;
  });
  function start() {
    purchase.mutate({ conState, auction });
  }
  const debouncedClick = useCallback(
    debounce(start, 3000, {
      leading: true,
      trailing: false,
    }),
    []
  );

  return (
    <>
      <div className="my-4 text-yellow">
        <strong>Bid:</strong> {formatPrice(auction.winning_bid?.bid_price)} /{" "}
        {usdToEth(auction.winning_bid?.bid_price, oracle)} ETH
      </div>
      <button
        className="!bg-yellow disabled:opacity-80  !text-dark"
        onClick={debouncedClick}
        disabled={!isMetamaskInstalled || !oracle.data || purchase.isLoading}
      >
        Buy Now{" "}
        <LoadingIndicator
          className="ml-2 text-dark"
          isLoading={purchase.isLoading}
        />
      </button>
      <p className="px-3 py-1 mt-4 text-sm font-semibold leading-6 text-black bg-yellow ">
        Caution: Do not lower the gas limit in Metamask. Your transaction will
        likely fail.
      </p>

      {!isMetamaskInstalled && (
        <p className="mt-6 text-base leading-6 text-red ">
          You'll need to install Metamask to pay with ETH. Visit a wallet
          provider website like MetaMask.io to get started.
        </p>
      )}
    </>
  );
}
export function AuctionBuyButton({ auction, amount = 0, className }) {
  const oracle = useOracle();
  const client = useQueryClient();
  const { user } = useAuth((data) => data.user);
  const { onConnect, conState } = useWeb3Modal();
  const metamask = useMetamask();
  const purchase = useMutation(async ({ conState, auction }) => {
    var { web3, address } = conState;
    if (!web3 || !address) {
      const res = await onConnect();
      web3 = res.web3;
      address = res.address;
      if (!address || !web3) {
        throw Error("You need to connect Metamask");
      }
    }
    console.log(JSON.stringify(oracle.data, null, 2));
    await oracle.refetch();
    console.log(JSON.stringify(oracle.data, null, 2));
    await metamask
      .mutateAsync({
        web3,
        account: address,
        userId: user.user_id,
        cartData: [
          {
            edition_id: auction.edition_id,
            item_id: auction.item_id,
            address: auction.address,
          },
        ],
        total: new BigNumber(amount).dividedBy(
          new BigNumber(oracle?.data?.price)
        ),
        totalUSD: [parseFloat(amount)],
        isAuction: true,
        auction_id: auction.id,
      })
      .catch((err) => {
        throw err;
      });
    return;
  });

  function start() {
    purchase.mutate({ conState, auction });
  }
  const debouncedClick = useCallback(
    debounce(start, 3000, {
      leading: true,
      trailing: false,
    }),
    []
  );
  return (
    <>
      <button
        className={className}
        onClick={debouncedClick}
        disabled={
          purchase.isLoading ||
          !isMetamaskInstalled ||
          !oracle.data ||
          client.isFetching(["auction", auction.id])
        }
      >
        Buy Now{" "}
        <LoadingIndicator
          className="ml-2 text-dark"
          isLoading={
            purchase.isLoading || client.isFetching(["auction", auction.id])
          }
        />
      </button>
      {!purchase.isLoading && purchase.isError && (
        <div className="px-4 py-2 mt-4 text-sm font-semibold border-2 bg-red-50 border-primary text-primary ">
          {typeof purchase.error == "object"
            ? JSON.stringify(purchase.error, null, 2)
            : String(purchase.error)}
        </div>
      )}
      {!isMetamaskInstalled && (
        <p className="mt-2 text-sm font-semibold leading-6 text-primary-dark ">
          You'll need to install Metamask to pay with ETH. Visit a wallet
          provider website like MetaMask.io to get started.
        </p>
      )}
    </>
  );
}
