import { useAuction, useAuctionBids } from "@api/useAuction";
import useAuth from "@api/useAuth";
import { useEdition } from "@api/useItems";
import { usePurchases, useSubscribeToAuctionAbly } from "@api/useProfile";
import { Timer } from "@components/Auction";
import AuctionWinnerNotification, {
  AuctionBuyButton,
} from "@components/AuctionWinnerNotification";
import BidButton from "@components/BidButton";
import Breadcrumbs from "@components/Breadcrumbs";
import Countdown from "@components/Countdown";
import DescriptionCollapse from "@components/DescriptionCollapse";
import EditAuction from "@components/EditAuction";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import MediaSlider from "@components/MediaSlider";
import ProtectedComponent from "@components/ProtectedComponent";
import { css } from "@emotion/react";
import BidWallet from "@icons/bid-wallet";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import cn from "classnames";
import { formatDistanceToNow } from "date-fns";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import React, { useEffect, useState } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { MdKeyboardArrowLeft, MdVerifiedUser } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import tw from "twin.macro";

export default function Auction({ params }) {
  const auction = useAuction(params.id);
  const bids = useAuctionBids(params.id);
  const { user } = useAuth();
  useEffect(() => {
    if (auction.isSuccess) {
      auction.refetch();
    }

    if (bids.isSuccess) {
      bids.refetch();
    }
  }, []);

  const auctionItem = auction.data;
  const { data: edition } = useEdition(auctionItem?.edition_id);
  const max = bids?.data?.sort((a, b) => {
    return parseFloat(a.bid_price) < parseFloat(b.bid_price) ? 1 : -1;
  })?.[0]?.bid_price;

  useEffect(() => {
    if (auction.isSuccess) {
    }
  }, []);

  return (
    <Layout>
      <ProtectedComponent redirect={`/marketplace/auction/${params.id}`}>
        <AblySubscriptions id={params.id} />
        <div className="h-[100px] lg:h-[180px]"></div>

        <LoadingIndicator isLoading={auction.isLoading} robot />
        {auctionItem && edition && (
          <div className="container pb-20 mt-10">
            {" "}
            <Breadcrumbs>
              <span
                className="cursor-pointer"
                onClick={() => {
                  window.history?.state?.key
                    ? window.history.back()
                    : navigate("/marketplace");
                }}
              >
                <MdKeyboardArrowLeft className="inline-block" />{" "}
                <FormattedMessage id="back" />
              </span>
            </Breadcrumbs>
            <div className="row cols-full xl:cols-1/2 row-y-10 row-x-10">
              <div>
                <MediaSlider
                  editionId={edition.edition_id}
                  items={edition?.media}
                  isLocked={false}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="text-xs ">
                    <span
                      className={cn("inline-block px-3 py-1 leading-normal  ", {
                        "bg-primary text-white": !auctionItem.silent_auction,
                        "bg-green/20 text-green": auctionItem.silent_auction,
                      })}
                    >
                      {auctionItem.silent_auction
                        ? "Silent auction"
                        : "Auction"}
                    </span>
                    <LoadingIndicator
                      className="ml-2"
                      isLoading={auction.isFetching}
                    />
                  </div>
                  {auctionItem && <Timer highlight auction={auctionItem} />}
                </div>
                <div className="mb-8">
                  <h1 className="mb-2 text-3xl">
                    {edition.edition_name}
                    <br />{" "}
                    <span className="text-base text-yellow/70">
                      Mint #{formatMintNumber(auctionItem.item_id)} of{" "}
                      {edition.total_minted}
                    </span>{" "}
                    <span className="text-base text-yellow/70">
                      / Network:{" "}
                      <span className="capitalize">{edition.network}</span>
                    </span>
                  </h1>
                  <DescriptionCollapse description={edition.description} />
                  <p className="flex items-center mt-4 space-x-2 font-semibold max-w-none">
                    {" "}
                    Owner:{" "}
                    {auctionItem.user_id ===
                    "26fd56b4-c962-4f6e-9174-d6a242eae5b5" ? (
                      <>
                        Official Epik Auctions{" "}
                        <span className="inline-flex items-center ml-2 !text-blue-400">
                          <MdVerifiedUser className="inline-block" />
                          Verified
                        </span>
                      </>
                    ) : auctionItem.user_name.trim() != "" ? (
                      auctionItem.user_name
                    ) : (
                      `User #${auctionItem.user_id?.slice(0.6)}`
                    )}{" "}
                  </p>
                  {auctionItem.silent_auction &&
                  auctionItem.user_id !== user?.user_id ? (
                    <>
                      <div className="mt-4">
                        Total bids: <span>{auctionItem?.total_bids}</span>
                        {auctionItem?.reserved_price_met && (
                          <>
                            {auctionItem?.reserved_price_met == "met" ? (
                              <span className="inline-flex items-center px-2 py-1 ml-4 space-x-1 text-sm font-semibold rounded bg-green/20 text-green">
                                <IoMdInformationCircle />
                                <span> Reserve price met</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 ml-4 space-x-1 text-sm font-semibold rounded bg-yellow/20 text-yellow">
                                <IoMdInformationCircle />
                                <span> Reserve price not met</span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="mt-4 text-green">
                        This is a silent auction! Bids will be visible only to
                        an auction owner. At the end of the auction everyone can
                        see the winner of the auction.
                      </div>
                    </>
                  ) : (
                    <>
                      {max && (
                        <p className="mt-4">
                          🔥 Last price: {formatPrice(max)}{" "}
                          {auctionItem?.reserved_price_met && (
                            <>
                              {auctionItem?.reserved_price_met == "met" ? (
                                <span className="inline-flex items-center px-2 py-1 ml-4 space-x-1 text-sm font-semibold rounded bg-green/20 text-green">
                                  <IoMdInformationCircle />
                                  <span> Reserve price met</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 ml-4 space-x-1 text-sm font-semibold rounded bg-yellow/20 text-yellow">
                                  <IoMdInformationCircle />
                                  <span> Reserve price not met</span>
                                </span>
                              )}
                            </>
                          )}
                        </p>
                      )}

                      <p className="mt-1 space-x-2 prose-sm opacity-70 max-w-none">
                        <span>Min price:</span>
                        <strong>
                          {formatPrice(parseFloat(auctionItem?.min_price))}
                        </strong>{" "}
                        {auctionItem?.reserve_price &&
                          parseFloat(auctionItem?.reserve_price) > 0 && (
                            <strong>
                              <>
                                <span>Reserve price:</span>{" "}
                                {formatPrice(
                                  parseFloat(auctionItem?.reserve_price)
                                )}
                              </>
                            </strong>
                          )}
                        {parseFloat(auctionItem?.buy_now_price) > 0 &&
                        parseFloat(auctionItem?.buy_now_price) != 999999 ? (
                          <>
                            <span>Buy now:</span>
                            <strong>
                              {formatPrice(
                                parseFloat(auctionItem?.buy_now_price)
                              )}
                            </strong>
                          </>
                        ) : null}
                      </p>
                    </>
                  )}

                  <div className="mt-4">
                    <BidButton
                      edition_id={edition.edition_id}
                      auctionId={params.id}
                      className="space-x-2"
                    >
                      <BidWallet />
                      <span>Bid</span>
                    </BidButton>
                  </div>
                  <div className="flex items-center mt-4 space-x-5">
                    <EditAuctionButton auction={auctionItem} />{" "}
                    <UserItemLink
                      edition_id={auctionItem?.edition_id}
                      item_id={auctionItem?.item_id}
                    />
                  </div>
                </div>
                <AuctionWinnerNotification auction={auctionItem} />
                {auctionItem?.completed && !auctionItem.succeed && (
                  <div className="p-6 text-lg font-semibold bg-yellow/20 text-yellow">
                    Auction ended without a winner!
                  </div>
                )}
                <div className="divide-y divide-white divide-opacity-10">
                  <div className="py-8">
                    <div>
                      <h2 className="flex items-center text-xl">
                        <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
                        Bid History:{" "}
                        <LoadingIndicator
                          className="ml-2 text-sm opacity-80"
                          isLoading={bids.isFetching}
                        />
                      </h2>
                      <div className="mt-8">
                        <div className="overflow-x-hidden ">
                          <LoadingIndicator isLoading={bids.isLoading} />
                          {bids?.data?.length === 0 && (
                            <>
                              {auctionItem?.silent_auction ? (
                                <div>
                                  <p className="mb-2">
                                    You can't see bid history for a silent
                                    auction.
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="mb-2">
                                    No bids placed so far! Be the first one to
                                    place a bid on the item.
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                          {bids?.data?.length > 0 && (
                            <div>
                              <BidsTable
                                auction={auctionItem}
                                data={bids?.data}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ProtectedComponent>
    </Layout>
  );
}

function BidsTable({ data, auction }) {
  const { user } = useAuth();
  return (
    <>
      {data ? (
        <div
          className="space-y-3"
          css={css`
            .table-cols {
              display: grid;
              ${tw` phone:py-3`}
              grid-template-areas: "fire price price" ". user time";
              grid-template-columns: 30px auto 1fr;
              @media (min-width: 768px) {
                grid-template-areas: "fire user price time";
                grid-template-columns: 30px 1fr 1fr 2fr;
              }
              > div:nth-child(1) {
                grid-area: fire;
              }
              > div:nth-child(2) {
                grid-area: user;
                ${tw`phone:text-sm`}
                @media (max-width: 767px) {
                  &:after {
                    content: "-";
                    ${tw`relative -right-1`}
                  }
                }
              }
              > div:nth-child(3) {
                grid-area: price;
              }
              > div:nth-child(4) {
                grid-area: time;
                ${tw`phone:text-sm`}
              }
              > div {
                ${tw`px-2`}
              }
            }
          `}
        >
          <div className=" phone:hidden">
            <div className="table-cols">
              <div></div>
              <div>Users</div>
              <div>Price</div>
              <div>Time</div>
            </div>
          </div>

          {data
            ?.sort((a, b) => {
              return parseFloat(a.bid_price) < parseFloat(b.bid_price) ? 1 : -1;
            })
            ?.map((bid) => {
              const highlighted =
                (bid.buy_now_bid && bid.buy_now_ends) ||
                auction.buy_now_pending == bid.bidder_id;

              const username = Boolean(bid?.user_name?.trim())
                ? bid.user_name
                : "User " + bid.bidder_id.slice(0, 6);

              return (
                <div
                  key={bid.id}
                  className={cn({
                    "bg-yellow/20": highlighted,
                  })}
                >
                  {highlighted && (
                    <div className="px-4 py-2 bg-yellow text-dark">
                      <h4 className="mb-0 ">
                        BUY NOW BID!{" "}
                        <span className="inline-block px-2 ml-1 text-sm text-white uppercase rounded-sm bg-dark">
                          {parseFloat(bid?.eth_amount) === 0 &&
                            "Waiting for user"}
                          {parseFloat(bid?.eth_amount) > 0 &&
                            "Transaction in progress"}
                        </span>{" "}
                      </h4>{" "}
                      {bid?.buy_now_status == "waiting" && (
                        <p className="text-sm font-semibold">
                          {bid?.bidder_id == user?.user_id
                            ? "You have "
                            : `User ${username} has `}
                          <Countdown minutesOnly date={bid.buy_now_ends}>
                            {(time, ended) =>
                              ended ? "no time" : <span>{time}</span>
                            }
                          </Countdown>{" "}
                          to make a purchase.
                        </p>
                      )}
                      {bid?.buy_now_status == "processing" && (
                        <p className="text-sm font-semibold">
                          Metamask transaction in progress! If finished
                          successfully {username} will get the item.
                        </p>
                      )}
                      <Countdown minutesOnly date={bid.buy_now_ends}>
                        {(time, ended) =>
                          ended ? null : bid?.bidder_id == user?.user_id &&
                            parseFloat(bid?.eth_amount || 0) == 0 ? (
                            <div>
                              <AuctionBuyButton
                                amount={bid.bid_price}
                                className="mt-2 "
                                auction={auction}
                              />
                              <p className="px-3 py-1 mt-2 text-sm font-semibold leading-6 text-black bg-red/20">
                                Caution: Do not lower the gas limit in Metamask.
                                Your transaction will likely fail.
                              </p>
                            </div>
                          ) : null
                        }
                      </Countdown>{" "}
                      {bid?.bidder_id != user?.user_id && (
                        <Countdown minutesOnly date={auction.end_at}>
                          {(time, ended) =>
                            ended ? null : (
                              <p className="p-2 mt-3 text-xs font-semibold bg-white/50">
                                ** You can still place bids, but if user{" "}
                                {username} finalizes the purchase of the item,
                                the auction will end, and {username} will get
                                the item.
                              </p>
                            )
                          }
                        </Countdown>
                      )}
                    </div>
                  )}
                  <div
                    className={cn("py-2 table-cols ", {
                      "bg-primary-dark  ": !highlighted,
                      "!bg-green/20 text-green":
                        auction?.winning_bid &&
                        auction?.winning_bid?.bidder_id == bid.bidder_id,
                    })}
                  >
                    <div>
                      {auction?.winning_bid &&
                        auction?.winning_bid?.bidder_id == bid.bidder_id && (
                          <>🔥</>
                        )}
                    </div>
                    <div> {username} </div>
                    <div>
                      {" "}
                      <span className="opacity-50 md:hidden">Price:</span>{" "}
                      {formatPrice(bid.bid_price)}
                    </div>
                    <div>
                      <Time time={bid.bid_time} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : null}
    </>
  );
}
function Time({ time }) {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return formatDistanceToNow(new Date(time), {
    addSuffix: true,
    includeSeconds: true,
  });
}
function EditAuctionButton({ auction }) {
  const { user, isLoading } = useAuth();

  if (user?.user_id === auction.user_id) {
    return <EditAuction auction={auction} textOnly />;
  } else if (isLoading) {
    return <LoadingIndicator isLoading />;
  } else {
    return null;
  }
}

function AblySubscriptions({ id }) {
  const { subscribe, unsubscribe } = useSubscribeToAuctionAbly();
  const client = Boolean(typeof window !== "undefined" && window?.__ably);
  useEffect(() => {
    subscribe({ id });
    return () => {
      unsubscribe({ id });
    };
  }, [client]);
  return null;
}

function UserItemLink({ edition_id, item_id }) {
  const { purchases } = usePurchases();
  const item = purchases?.find(
    (i) => i.edition_id == edition_id && i.item_id == item_id
  );
  return item ? (
    <Link
      className="underline"
      to={`/marketplace/profile/items/${edition_id}/${item_id}`}
    >
      See Item details
    </Link>
  ) : null;
}
