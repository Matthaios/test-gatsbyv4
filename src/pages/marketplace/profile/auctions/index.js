import useAuth from "@api/useAuth";
import { useAuctions } from "@api/useProfile";
import Auction from "@components/Auction";
import LoadingIndicator from "@components/LoadingIndicator";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import { css } from "@emotion/react";
import auctionUtils from "@utils/auctionUtils";
import formatDate from "@utils/formatDate";
import formatPrice from "@utils/formatPrice";
import cn from "classnames";
import { Link } from "gatsby";
import React, { useState } from "react";
import tw from "twin.macro";

export default function Auctions() {
  const { auctions, bids, isLoading, status } = useAuctions();
  const [columns, setColumns] = useState("auctions");
  return (
    <ProfileSubPagesLayout>
      <LoadingIndicator robot isLoading={isLoading} />
      {status == "success" && (
        <div className="flex items-center justify-start pb-5 -mt-3 space-x-4">
          <div
            onClick={() => {
              setColumns("auctions");
            }}
            className={cn("px-4 border-b-4 cursor-pointer ", {
              "border-transparent": columns == "bids",
              "border-primary": columns == "auctions",
            })}
          >
            Auctions
          </div>
          <div
            onClick={() => {
              setColumns("bids");
            }}
            className={cn("px-4 border-b-4 cursor-pointer ", {
              "border-primary": columns == "bids",
              "border-transparent": columns == "auctions",
            })}
          >
            Bids
          </div>
        </div>
      )}
      {columns == "auctions" && <AuctionsGrid auctions={auctions} />}
      {columns == "bids" && <BidsGrid bids={bids} />}
    </ProfileSubPagesLayout>
  );
}

function AuctionsGrid({ auctions }) {
  return (
    <>
      <div
        className="mb-12 "
        css={css`
          .grid-template {
            ${tw`grid gap-y-2`}
            grid-template-columns: repeat(4, minmax(min-content, 1fr));

            grid-template-areas: "id item item item" "prices prices prices prices" "date date status status";
            .item {
              grid-area: item;
            }
            .prices {
              grid-area: prices;
            }
            .date {
              grid-area: date;
            }
            .platform {
              grid-area: platform;
            }
            .status {
              grid-area: status;
            }

            @media (min-width: 768px) {
              grid-template-columns: repeat(3, minmax(min-content, 1fr));

              grid-template-areas: "id item item" "prices date status";
            }
            @media (min-width: 1024px) {
              grid-template-columns: 1fr 2fr 4fr 3fr 2fr;
              grid-template-areas: "id item prices date status";
            }

            > span {
              ${tw`p-4 tablet:py-1`}
            }
          }
        `}
      >
        {auctions?.length === 0 && (
          <p>You haven't put any of your items up for auction.</p>
        )}
        {auctions?.length > 0 && (
          <div className="grid-template bg-primary-dark  tablet:!hidden">
            <span>ID</span>
            <span>Item</span>
            <span>Prices</span>
            <span>Date </span>
            <span>Status</span>
          </div>
        )}

        {auctions
          ?.sort((a, b) => {
            return parseInt(b.id) - parseInt(a.id);
          })
          ?.map((auction) => {
            return (
              <Link
                to={`/marketplace/auction/${auction.id}`}
                key={auction.id}
                className="py-2 border-t border-white grid-template border-opacity-20 hover:bg-primary hover:bg-opacity-20"
              >
                <span className="id">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    ID
                  </div>
                  {auction.id}
                </span>
                <span className="item">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    Item
                  </div>
                  {auction.title}
                </span>
                <span className="prices">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    Prices
                  </div>
                  <div className="flex space-x-3 prose-sm max-w-none">
                    <strong>
                      {formatPrice(parseFloat(auction?.min_price))} <br />
                      <span className="opacity-50">Min price </span>
                    </strong>{" "}
                    <strong>
                      {parseFloat(auction?.reserve_price) > 0
                        ? formatPrice(parseFloat(auction?.reserve_price))
                        : "-"}
                      <br /> <span className="opacity-50">Reserve </span>
                    </strong>{" "}
                    <strong>
                      {parseFloat(auction?.buy_now_price) > 0 &&
                      parseFloat(auction?.buy_now_price) != 999999
                        ? formatPrice(parseFloat(auction?.buy_now_price))
                        : "-"}
                      <br /> <span className="opacity-50">Buy now </span>
                    </strong>
                  </div>
                </span>

                <span className="capitalize date">
                  <div className="flex flex-col space-y-2 prose-sm max-w-none">
                    {" "}
                    <strong>
                      <span className="opacity-50">Starts: </span>{" "}
                      {formatDate(auction.start_at, "MMMM d, yyyy h:mm")}
                    </strong>{" "}
                    <strong>
                      <span className="opacity-50">Ends: </span>{" "}
                      {formatDate(auction.end_at, "MMMM d, yyyy h:mm")}
                    </strong>{" "}
                  </div>
                </span>
                <span className={"capitalize status text-center"}>
                  <div className="mb-1 text-xs font-bold lg:hidden opacity-60">
                    Status:
                  </div>
                  <Auction.Timer
                    highlight
                    labels={{ ongoing: "Ongoing" }}
                    auction={auction}
                  />
                </span>
              </Link>
            );
          })}
      </div>
    </>
  );
}
function BidsGrid({ bids }) {
  const { user } = useAuth((data) => data.user);

  return (
    <>
      <div
        className="mb-12 "
        css={css`
          .grid-template {
            ${tw`grid gap-y-2`}
            grid-template-columns: repeat(4, minmax(min-content, 1fr));

            grid-template-areas: "id item item item" "prices prices prices prices" "date date status status";
            .item {
              grid-area: item;
            }
            .prices {
              grid-area: prices;
            }
            .date {
              grid-area: date;
            }
            .platform {
              grid-area: platform;
            }
            .status {
              grid-area: status;
            }

            @media (min-width: 768px) {
              grid-template-columns: repeat(3, minmax(min-content, 1fr));

              grid-template-areas: "id item item" "prices date status";
            }
            @media (min-width: 1024px) {
              grid-template-columns: 1fr 2fr 4fr 3fr 2fr;
              grid-template-areas: "id item prices date status";
            }

            > span {
              ${tw`p-4 tablet:py-1`}
            }
          }
        `}
      >
        {bids?.length === 0 && <p>You haven't placed a bid in any auctions.</p>}
        {bids?.length > 0 && (
          <div className="grid-template bg-primary-dark  tablet:!hidden">
            <span>ID</span>
            <span>Item</span>
            <span>Prices</span>
            <span>Date </span>
            <span>Status</span>
          </div>
        )}

        {bids
          ?.sort((a, b) => {
            return parseInt(b.auction_id) - parseInt(a.auction_id);
          })
          ?.map((bid) => {
            return (
              <Link
                to={`/marketplace/auction/${bid.auction_id}`}
                key={bid.auction_id}
                className="py-2 border-t border-white grid-template border-opacity-20 hover:bg-primary hover:bg-opacity-20"
              >
                <span className="id">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    Auction ID
                  </div>
                  {bid.auction_id}
                </span>
                <span className="item">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    Item
                  </div>
                  {bid?.auction?.title}
                </span>
                <span className="prices">
                  <div className="text-xs font-bold lg:hidden opacity-60">
                    Prices
                  </div>
                  <div className="flex flex-col space-y-2 prose-sm max-w-none">
                    {" "}
                    <strong>
                      <span className="opacity-50">My bid: </span>{" "}
                      {formatPrice(parseFloat(bid?.bid_price))}
                    </strong>{" "}
                    <strong>
                      <span className="opacity-50">Highest bid: </span>{" "}
                      {formatPrice(
                        parseFloat(bid?.auction?.highest_bid?.bid_price)
                      )}
                    </strong>{" "}
                    {auctionUtils.getStage(bid?.auction) == "waiting" &&
                      bid?.auction.winner == user.user_id && (
                        <strong className="font-semibold text-green">
                          You are the winner! Claim this item now!
                        </strong>
                      )}
                  </div>
                </span>

                <span className="capitalize date">
                  <div className="flex flex-col space-y-2 prose-sm max-w-none">
                    {" "}
                    <strong>
                      <span className="opacity-50">Starts: </span>{" "}
                      {formatDate(bid?.auction?.start_at, "MMMM d, yyyy h:mm")}
                    </strong>{" "}
                    <strong>
                      <span className="opacity-50">Ends: </span>{" "}
                      {formatDate(bid?.auction?.end_at, "MMMM d, yyyy h:mm")}
                    </strong>{" "}
                  </div>
                </span>
                <span className={"capitalize status text-center"}>
                  <div className="mb-1 text-xs font-bold lg:hidden opacity-60">
                    Status:
                  </div>
                  <Auction.Timer
                    labels={{ ongoing: "Ongoing" }}
                    auction={bid?.auction}
                  />
                </span>
              </Link>
            );
          })}
      </div>
    </>
  );
}
