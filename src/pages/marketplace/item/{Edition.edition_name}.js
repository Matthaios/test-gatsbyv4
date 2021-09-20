import { useListAuctions } from "@api/useAuction";
import { useToken } from "@api/useAuth";
import useIsLocked from "@api/useIsLocked";
import { useEdition } from "@api/useItems";
import useMarketplaceUI from "@api/useMarketplaceUI";
import AddToCartButton from "@components/AddToCartButton";
import Auction from "@components/Auction";
import BidButton from "@components/BidButton";
import Breadcrumbs from "@components/Breadcrumbs";
import DescriptionCollapse from "@components/DescriptionCollapse";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import MediaSlider from "@components/MediaSlider";
import OwnedItemsInformation from "@components/OwnedItemsInformation";
import { SubtleBonusNotification } from "@components/UnlockedItemNotification";
import { css } from "@emotion/react";
import { Listbox } from "@headlessui/react";
import { useLocation } from "@reach/router";
import auctionUtils from "@utils/auctionUtils";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import Sort from "@utils/sort";
import cn from "classnames";
import { graphql, Link, navigate } from "gatsby";
import React, { useMemo, useState } from "react";
import { BsFillCaretDownFill } from "react-icons/bs";
import { FaCartPlus, FaFilter } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import tw from "twin.macro";

export default function EditionPage({ data }) {
  const { item: edition } = useEdition(data.edition?.edition_id);
  const isLocked = useIsLocked(edition);
  return (
    <Layout>
      <div className="h-[100px] md:h-[180px]"></div>
      <div className="container pb-20 mt-10">
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

        <div className="row row-x-8 row-y-12" data-testid="edition-details">
          <div className="w-full lg:w-1/2">
            <MediaSlider
              editionId={edition.edition_id}
              items={edition?.media}
              isLocked={isLocked}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs ">
                <span className="inline-block px-3 py-1 leading-normal text-white bg-primary">
                  Game{" "}
                  {process.env.NODE_ENV === "development"
                    ? `#${edition.edition_id}`
                    : null}
                </span>
                {edition?.sold_out ? (
                  <>
                    {" "}
                    <span className="inline-block w-2 h-2 ml-8 mr-2 rounded-full bg-red "></span>
                    <FormattedMessage id="item.not_in_stock" />
                  </>
                ) : (
                  <>
                    {" "}
                    <span className="inline-block w-2 h-2 ml-8 mr-2 rounded-full bg-green "></span>
                    <FormattedMessage id={"item.in_stock"} />
                  </>
                )}
              </div>
            </div>
            <div className="mb-8">
              <h1 className="mb-2 text-3xl">{edition?.edition_name}</h1>
              <div className="mb-6">
                <DescriptionCollapse description={edition?.description} />
              </div>
              {parseFloat(edition?.token_price) > 0 && (
                <p className="mb-6 text-lg font-semibold">
                  <strong>
                    <FormattedMessage id="item.epik_price" />:{" "}
                    {formatPrice(edition?.token_price)}
                  </strong>
                </p>
              )}
              <AddToCartButton icon={<FaCartPlus />} item={edition} />
              <div className="mt-6">
                <SubtleBonusNotification
                  editionId={edition.edition_id}
                  inline={true}
                />
              </div>
              <OwnedItemsInformation editionId={data.edition?.edition_id} />
            </div>
            <ProductInformation edition={edition} />
            <Listings edition={edition} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Listings({ edition }) {
  const [tab, setTab] = useState("auction");

  const [{ auctionsFilters }, set] = useMarketplaceUI();
  const location = useLocation();
  const token = useToken();

  const filters = (tab) => {
    return [
      {
        label: "Lowest Mint #",
        options: {
          sort: { key: "item_id", order: "asc" },
        },
      },
      {
        label: "Time Left",
        options: {
          sort: {
            key: (item) => {
              return new Date(item.end_at);
            },
            order: "desc",
          },
        },
      },
      {
        label: "Lowest Price",
        options: {
          sort: {
            key: (item) => {
              if (tab == "auction") {
                return item?.highest_bid?.bid_price
                  ? parseFloat(item?.highest_bid?.bid_price)
                  : parseFloat(item.min_price);
              } else {
                const buyNow = parseFloat(item.buy_now_price);
                const highest = item?.highest_bid?.bid_price
                  ? parseFloat(item?.highest_bid?.bid_price)
                  : 0;
                return buyNow > highest ? buyNow : highest;
              }
            },
            order: "asc",
          },
        },
      },
    ];
  };
  const [filter, setFilter] = useState(filters(tab)[auctionsFilters]);
  function handleFilterChange(data) {
    set((state) => {
      state.auctionsFilters = filters(tab).findIndex(
        (f) => f.label == data.label
      );
    });
    setFilter(data);
  }
  return (
    <div className="divide-y divide-white divide-opacity-10">
      <div className="py-8">
        <div>
          <h2 className="flex items-center text-xl">
            <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
            Listings:
          </h2>

          <div className="flex flex-col justify-between mt-6 space-y-3 xs:space-y-0 xs:items-center xs:flex-row">
            <div className="space-x-4 font-semibold">
              <span
                onClick={() => {
                  setTab("auction");
                }}
                className={cn(
                  "opacity-50 cursor-pointer pb-2  border-b-4 border-transparent",
                  {
                    "!opacity-100 !border-primary": tab == "auction",
                  }
                )}
              >
                Auction
              </span>
              <span
                onClick={() => {
                  setTab("sale");
                }}
                className={cn(
                  "opacity-50 cursor-pointer pb-2  border-b-4 border-transparent",
                  {
                    "!opacity-100 !border-primary": tab == "sale",
                  }
                )}
              >
                For Sale
              </span>
            </div>
            <Listbox
              as="div"
              value={filter}
              onChange={handleFilterChange}
              className="relative "
            >
              <Listbox.Label className="font-semibold opacity-70">
                <FaFilter className="inline-block mr-2 text-sm " />
                Sort by:{"  "}
              </Listbox.Label>
              <Listbox.Button className="font-semibold strip-button-styles focus:outline-none">
                {filter.label} <BsFillCaretDownFill className="inline" />
              </Listbox.Button>
              <Listbox.Options className="absolute right-0 z-30 shadow top-10 bg-primary-dark ring-2 ring-white/20">
                {filters(tab).map((f) => {
                  return (
                    <Listbox.Option
                      key={f.label}
                      value={f}
                      className="px-4 py-3 font-semibold cursor-pointer hover:bg-white/20"
                    >
                      {f.label}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Listbox>{" "}
          </div>

          {!token?.data?.token && (
            <div className="mt-6">
              <p>Login to see auctions for this item.</p>
              <p>
                <Link
                  className="mt-3 button"
                  to={`/marketplace/login?redirect=${location.pathname}`}
                >
                  <FormattedMessage id="user.sign_in" />
                </Link>
              </p>
            </div>
          )}
          <div className="mt-8">
            {tab === "auction" && (
              <AuctionsListing
                filter={filter}
                edition_id={edition?.edition_id}
              />
            )}
            {tab === "sale" && (
              <SaleListing filter={filter} edition_id={edition?.edition_id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuctionsListing({ edition_id, filter }) {
  const auctions = useListAuctions(edition_id);
  const list = useMemo(() => {
    return Sort(auctions?.data, filter.options);
  }, [filter.label, auctions?.data]);
  return (
    <div>
      <LoadingIndicator isLoading={auctions.isLoading} />
      {list?.length === 0 && <div>No auctions for this item.</div>}

      {list?.length > 0 && (
        <div
          className="grid gap-y-2"
          css={css`
            .grid-template {
              ${tw`grid items-center px-4 py-2 phone:gap-y-2 gap-x-4 tablet:text-sm`};

              grid-template-areas:
                "price time"
                "link link ";
              grid-template-columns: 1fr 2fr;
              @media (min-width: 768px) {
                grid-template-areas: "item price time link";
                grid-template-columns: 1fr 2fr 3fr 2fr;
              }

              .item {
                ${tw`phone:hidden`}
                grid-area: item;
              }
              .price {
                grid-area: price;
              }
              .time {
                grid-area: time;
              }
              .link {
                grid-area: link;
                ${tw`phone:text-left`}
              }
            }
            .thead {
              .tr {
                ${tw`font-semibold opacity-50 phone:hidden`}
              }
            }
            .tbody {
              ${tw`space-y-2`}
              .tr {
                span {
                  min-width: 0;
                }
              }
            }
          `}
        >
          <div className="thead grid grid-cols-[1fr,100px]">
            <div className="tr grid-template">
              <span>Mint #</span>
              <span>Price</span>
              <span>Time</span>
              <span></span>
            </div>
            <div></div>
          </div>
          <div className="tbody">
            {list?.map((auction, index) => {
              const stage = auctionUtils.getStage(auction);
              return (
                <div
                  key={auction.id}
                  className="grid grid-cols-[1fr,100px] max-w-full min-w-0"
                >
                  <div className="tr bg-primary-dark grid-template">
                    <span className="font-semibold item">
                      {formatMintNumber(auction.item_id)}
                    </span>
                    <span className="font-semibold price">
                      <span className="opacity-50 md:hidden">Price:</span>{" "}
                      {auction.silent_auction && "Hidden"}
                      {auction?.highest_bid?.bid_price
                        ? formatPrice(auction?.highest_bid?.bid_price)
                        : formatPrice(auction.min_price)}
                    </span>
                    <span className="font-semibold time">
                      <Auction.Timer auction={auction} />
                    </span>
                    <div className="text-right link">
                      <Link
                        className="text-sm underline opacity-50"
                        to={`/marketplace/auction/${auction.id}`}
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                  <BidButton
                    auctionId={auction.id}
                    edition_id={edition_id}
                    style={{ minWidth: 0 }}
                  >
                    Bid
                  </BidButton>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SaleListing({ edition_id, filter }) {
  const auctions = useListAuctions(edition_id, (data) =>
    data.filter((item) => parseFloat(item.buy_now_price) > 0)
  );
  const list = useMemo(() => {
    const ordered = Sort(auctions?.data, filter.options);
    return ordered;
  }, [filter.label, auctions?.isSuccess]);

  return (
    <div>
      <LoadingIndicator isLoading={auctions.isLoading} />
      {list?.length === 0 && <div>No items at sale.</div>}
      {list?.length > 0 && (
        <div
          className="grid gap-y-2"
          css={css`
            .grid-template {
              ${tw`grid items-center px-4 py-2 phone:gap-y-2 gap-x-4 tablet:text-sm`};

              grid-template-areas:
                "price time"
                "link link ";
              grid-template-columns: 1fr 2fr;
              @media (min-width: 768px) {
                grid-template-areas: "item price time link";
                grid-template-columns: 1fr 2fr 3fr 2fr;
              }

              .item {
                ${tw`phone:hidden`}
                grid-area: item;
              }
              .price {
                grid-area: price;
              }
              .time {
                grid-area: time;
              }
              .link {
                grid-area: link;
                ${tw`phone:text-left`}
              }
            }
            .thead {
              .tr {
                ${tw`font-semibold opacity-50 phone:hidden`}
              }
            }
            .tbody {
              ${tw`space-y-2`}
              .tr {
                span {
                  min-width: 0;
                }
              }
            }
          `}
        >
          <div className="thead grid grid-cols-[1fr,100px]">
            <div className="tr grid-template">
              <span>Mint #</span>
              <span>Price</span>
              <span>Time</span>
              <span></span>
            </div>
            <div></div>
          </div>
          <div className="tbody">
            {list?.map((auction, index) => {
              const stage = auctionUtils.getStage(auction);
              return (
                <div
                  key={auction.id}
                  className="grid grid-cols-[1fr,100px] max-w-full min-w-0"
                >
                  <div className="tr bg-primary-dark grid-template">
                    <span className="font-semibold item">
                      {formatMintNumber(auction.item_id)}
                    </span>
                    <span className="font-semibold price">
                      <span className="opacity-50 md:hidden">Price:</span>{" "}
                      {parseFloat(auction?.buy_now_price) <
                      parseFloat(auction?.highest_bid?.bid_price)
                        ? formatPrice(auction?.highest_bid?.bid_price)
                        : formatPrice(auction?.buy_now_price)}
                    </span>
                    <span className="font-semibold time">
                      <Auction.Timer auction={auction} />
                    </span>
                    <div className="text-right link">
                      <Link
                        className="text-sm underline opacity-50"
                        to={`/marketplace/auction/${auction.id}`}
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                  <BidButton
                    buyNow={auction.buy_now_price}
                    auctionId={auction.id}
                    edition_id={edition_id}
                    style={{ minWidth: 0 }}
                  >
                    Buy now
                  </BidButton>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductInformation({ edition }) {
  return (
    <div className="py-8">
      <div>
        <h2 className="flex items-center text-xl">
          <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
          <FormattedMessage id="item.product_information" />:
        </h2>
        <div className="grid grid-cols-[auto,1fr] md:grid-cols-[2fr,3fr,2fr,3fr] gap-x-3 gap-y-2 mt-8">
          <div className="contents">
            <span>
              <FormattedMessage id="item.network" />:
            </span>
            <span className="capitalize">{edition?.network}</span>
          </div>
          <div className="contents">
            <span>
              <FormattedMessage id="item.total" />:
            </span>
            <span>{edition?.total_minted}</span>
          </div>
          <div className="contents">
            <span>
              {" "}
              <FormattedMessage id="item.release_date" />:
            </span>
            <span>{edition?.distribution_start}</span>
          </div>

          <div className="contents">
            <span>
              <FormattedMessage id="item.publisher" />:
            </span>
            <span>{edition?.publisher_name}</span>
          </div>
          {parseFloat(edition?.token_price) > 0 && (
            <div className="contents">
              <span>
                <FormattedMessage id="item.lowest_ask" />:
              </span>
              <span>{formatPrice(edition?.token_price)}</span>
            </div>
          )}
          <div className="contents">
            <span>
              <FormattedMessage id="item.game" />:
            </span>
            <span>{edition?.app_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const query = graphql`
  query ($id: String) {
    edition(id: { eq: $id }) {
      ...Edition
    }
  }
`;
