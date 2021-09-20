import { useStartAuction } from "@api/useAuction";
import useAuth, { useUsersItem } from "@api/useAuth";
import useCookies from "@api/useCookies";
import { useEdition, useTransferItem } from "@api/useItems";
import { useAuctions, usePurchases } from "@api/useProfile";
import { useTransfers } from "@api/useTransfers";
import { isMetamaskInstalled } from "@api/useWeb3";
import Auction from "@components/Auction";
import AuctionWinnerNotification from "@components/AuctionWinnerNotification";
import Breadcrumbs from "@components/Breadcrumbs";
import DescriptionCollapse from "@components/DescriptionCollapse";
import EditAuction from "@components/EditAuction";
import {
  ErrorMessage,
  Form,
  InputCheckbox,
  InputDate,
  InputPrice,
  SubmitButton,
} from "@components/Form";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import MediaSlider from "@components/MediaSlider";
import Modal from "@components/Modal";
import OrderStatusBadge from "@components/OrderStatusBadge";
import OwnedItemsInformation from "@components/OwnedItemsInformation";
import ViewOnChain from "@components/ViewOnChain";
import formatDate from "@utils/formatDate";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import useWeb3Modal from "@utils/web3modal";
import cn from "classnames";
import { Link } from "gatsby";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDollarSign, FaRegCalendarAlt } from "react-icons/fa";
import {
  MdAccountBalanceWallet,
  MdClose,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { RiAuctionFill } from "react-icons/ri";
import { useIntl } from "react-intl";
import { useMutation } from "react-query";
import * as yup from "yup";

export default function ItemPage({ data, params }) {
  const { data: edition } = useEdition(params.edition_id);

  return (
    <Layout>
      <div className="h-[100px] lg:h-[180px]"></div>
      <div className="container pb-20 mt-10">
        {edition && (
          <Breadcrumbs
            paths={[
              {
                to: "/marketplace/profile",
                label: "Profile",
              },
              {
                to: "/marketplace/profile/items",
                label: "Items",
              },
            ]}
            label={edition.edition_name}
          />
        )}
        {edition && (
          <div className="grid xl:grid-cols-2 gap-y-20 gap-x-20">
            <MediaSlider editionId={edition.edition_id} items={edition.media} />
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs ">
                  <span className="inline-block px-3 py-1 leading-normal text-white bg-primary">
                    Game
                  </span>
                </div>
              </div>
              <div className="mb-8">
                <h1 className="mb-2 text-3xl">{edition.edition_name}</h1>
                <DescriptionCollapse description={edition.description} />
                {parseFloat(edition.token_price) > 0 && (
                  <p className="mt-4 text-lg font-semibold">
                    <strong>
                      Epik Price: {formatPrice(edition.token_price)}
                    </strong>
                  </p>
                )}
                <OwnedItemsInformation editionId={params.edition_id} />
                <div className="flex items-center mt-4 space-x-4">
                  <ViewOnChain />
                  <TransferToWallet params={params} />
                </div>
              </div>
              <ItemInformation params={params} />
              <ItemHistory params={params} />
              <ProductInformation edition={edition} />
              <ManageItem
                edition_id={params.edition_id}
                item_id={params.item_id}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function ManageItem({ edition_id, item_id }) {
  const { auctions, isLoading } = useAuctions();
  const { data: item, isLoading: itemIsLoading } = useUsersItem(
    edition_id,
    item_id
  );
  const auction = auctions?.find(
    (item) =>
      parseInt(item.item_id) == parseInt(item_id) &&
      item.edition_id == edition_id &&
      (!item.completed || (item.completed && item.succeed && !item.purchase_id))
  );

  if (itemIsLoading) {
    return <LoadingIndicator itemIsLoading />;
  }

  if (!item) {
    return null;
  }
  return (
    <>
      {auction && (
        <div className="py-8">
          <div>
            <h2 className="flex items-center text-xl">
              <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
              Auction:{" "}
              <div className="inline-block ml-4 text-base">
                <Auction.Timer highlight auction={auction} />
              </div>
            </h2>
            <div className="grid grid-cols-[auto,1fr] md:grid-cols-[2fr,3fr,2fr,3fr] gap-x-3 gap-y-2 mt-8">
              <div className="contents">
                <span>Started</span>
                <span>
                  {formatDate(auction.start_at, "MMMM d, yyyy")} <br />
                  {formatDate(auction.start_at, "h:mm aa")} <br />
                </span>
              </div>
              <div className="contents">
                <span>Ends</span>
                <span>
                  {formatDate(auction.end_at, "MMMM d, yyyy")} <br />
                  {formatDate(auction.end_at, "h:mm aa")} <br />
                </span>
              </div>{" "}
              <div className="contents">
                <span>Status</span>
                <span>{auction?.completed ? "Ended" : "Ongoing"}</span>
              </div>
              <div className="contents">
                <span>Minimum Price</span>
                <span>{formatPrice(auction.min_price)}</span>
              </div>
              <div className="contents">
                <span>Reserved Price</span>
                <span>
                  {parseFloat(auction.reserve_price || "0").toString() === "0"
                    ? "-"
                    : formatPrice(auction.reserve_price)}
                </span>
              </div>
              <div className="contents">
                <span>Buy Now Price</span>
                <span>
                  {parseFloat(auction.buy_now_price || "0").toString() === "0"
                    ? "-"
                    : formatPrice(auction.buy_now_price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <AuctionWinnerNotification auction={auction} />
      {!auction?.winning_bid && auction?.highest_bid && (
        <div
          className={cn(" font-bold inline-block ", {
            " text-green":
              parseFloat(auction.highest_bid.bid_price) >=
              parseFloat(auction.reserve_price),
            " text-yellow":
              parseFloat(auction.highest_bid.bid_price) <
              parseFloat(auction.reserve_price),
          })}
        >
          <p>
            <strong>Highest Bid:</strong>{" "}
            {formatPrice(auction.highest_bid.bid_price)}
          </p>{" "}
        </div>
      )}

      <div>
        {!auction && (
          <PutToAuctionButton
            disabled={isLoading}
            {...{ edition_id, item_id }}
          />
        )}
        <div className="mt-4 grid gap-6   xs:grid-cols-[repeat(2,minmax(auto,8rem))] ">
          {auction && (
            <Link to={`/marketplace/auction/${auction.id}`} className=" button">
              Go to auction
            </Link>
          )}
          {auction && !auction?.completed && <EditAuction auction={auction} />}
        </div>
      </div>
    </>
  );
}

function PutToAuctionButton({ edition_id, item_id, disabled }) {
  const { setCookie, getCookie } = useCookies();
  const auctionSellerMetamaskMessage = getCookie("auction-seller-metamask");
  const [metamaskNotification, setMetamaskNotification] = useState(false);

  const { edition } = useEdition(edition_id);
  const [auctionModalIsOpen, setAuctionModalIsOpen] = useState(false);
  const { item, isLoading: itemIsLoading } = useUsersItem(edition_id, item_id);
  const { onConnect, conState } = useWeb3Modal();
  const [address, setAddress] = useState(conState.address);

  const isDisabled = disabled || itemIsLoading || item?.is_locked;
  async function openAuctionModal() {
    setCookie("auction-seller-metamask", true, {
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

    if (address) {
      setAddress(address);
      setAuctionModalIsOpen(true);
    }
  }

  return (
    <>
      {isMetamaskInstalled && (
        <>
          {" "}
          <div className="mt-4 xs:col-span-2">
            <button
              disabled={isDisabled}
              className="mr-10"
              onClick={async () => {
                if (!auctionSellerMetamaskMessage) {
                  setMetamaskNotification(true);
                } else {
                  openAuctionModal();
                }
              }}
            >
              {item?.is_locked ? "Item is locked" : "Put up for auction"}{" "}
              <LoadingIndicator className="ml-2" isLoading={disabled} />
            </button>
          </div>
          <Modal
            disableClose
            {...{
              isOpen: auctionModalIsOpen,
              setIsOpen: setAuctionModalIsOpen,
            }}
          >
            <div className="max-h-[90vh] py-4 overflow-y-auto">
              <div className="mb-4 space-x-4 ">
                {[
                  // { tab: 0, label: "For Sale" },
                  { tab: 1, label: "Auction" },
                ].map((item) => {
                  return (
                    <span
                      key={item.tab}
                      className={cn(" border-b-2 font-semibold", {
                        "border-primary": true,
                        "border-transparent  opacity-50 cursor-pointer": false,
                      })}
                    >
                      {item.label}
                    </span>
                  );
                })}
              </div>
              <h3 className="text-2xl">{edition.edition_name}</h3>
              <h5 className="text-green">
                {" "}
                <span>Mint#: </span>
                <span>{formatMintNumber(item_id)}</span>
              </h5>
              <DescriptionCollapse description={edition.description} />
              <div className="pt-6">
                <PutItemForAuctionForm
                  address={address}
                  close={() => {
                    setAuctionModalIsOpen(false);
                  }}
                  item={{ ...edition, item_id }}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
      {!isMetamaskInstalled && (
        <div className="space-y-4 xs:col-span-2">
          <div>
            {" "}
            <button disabled>Metamask not installed</button>
          </div>
          <p className="text-sm opacity-80">
            To be able to put item on auction you need to have a Metamask
            account.
          </p>
        </div>
      )}
      <SellerMetamaskNotification
        isOpen={metamaskNotification}
        setIsOpen={setMetamaskNotification}
        callback={openAuctionModal}
      />
    </>
  );
}

function SellerMetamaskNotification({ isOpen, setIsOpen, callback }) {
  return (
    <Modal
      {...{
        isOpen,
        setIsOpen,
      }}
    >
      <p className="my-4 text-lg opacity-80">
        Auction winners will pay for items with ETH. Please link your Metamask
        wallet so that you can receive payment in ETH after the auction closes.
      </p>
      <p>
        <button
          className="mr-10"
          onClick={async () => {
            setIsOpen(false);
            callback();
          }}
        >
          I understand
        </button>
      </p>
    </Modal>
  );
}

function TransferToWallet({ params }) {
  const { edition } = useEdition(params.edition_id);
  const transferItem = useTransferItem();
  const { auctions, isLoading } = useAuctions();
  const transfers = useTransfers();
  const { user } = useAuth();
  const auction = auctions?.find(
    (item) =>
      parseInt(item.item_id) == parseInt(params.item_id) &&
      item.edition_id == params.edition_id &&
      (!item.completed || (item.completed && item.succeed && !item.purchase_id))
  );

  const { onConnect, conState } = useWeb3Modal();
  let { address, web3 } = conState;
  const transfer = useMutation(
    async () => {
      let { address, web3 } = conState;

      if (!address || !web3) {
        const res = await onConnect();

        address = res.address;
        web3 = res.web3;
      }

      if (user && address) {
        await transferItem.mutateAsync({
          web3,
          sender: address,
          receiver: address,
          itemId: params.item_id,
          editionId: params.edition_id,
          network: edition.network,
        });
      }

      return;
    },
    {
      onSuccess: () => {
        setIsOpen(false);
      },
    }
  );

  const { data: item } = usePurchases((d) =>
    d.purchases.find(
      (p) => p.edition_id == params.edition_id && p.item_id == params.item_id
    )
  );

  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState("init");
  if (transfers.isLoading) {
    return (
      <div className="inline-flex items-center space-x-2 ">
        <span>Loading data</span>
        <LoadingIndicator isLoading />
      </div>
    );
  }

  const hasAPendingTransfer = Boolean(
    transfers.data?.find((t) => t.item_id !== params.item_id && t.status === 0)
  );
  const thisItemTransferIsPending = Boolean(
    transfers.data?.find((t) => t.item_id == params.item_id && t.status === 0)
  );
  const canBeTransferedOut = !hasAPendingTransfer && !Boolean(auction);

  return (
    <>
      {item && !canBeTransferedOut && (
        <div>
          <span className="inline-flex items-center space-y-0 !leading-none">
            <span className="mr-2 ">
              Transfering locked
              <br />
              {Boolean(auction) ? (
                <span className="inline-block -mt-1 text-xs opacity-80">
                  ** Item is on auction.
                </span>
              ) : hasAPendingTransfer ? (
                <span className="inline-block -mt-1 text-xs opacity-80">
                  ** One of your items is being transfered out.
                </span>
              ) : null}
            </span>
          </span>{" "}
        </div>
      )}
      {item && canBeTransferedOut && (
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className="inline-flex items-center space-x-2 cursor-pointer"
        >
          <MdAccountBalanceWallet />
          <span className="!leading-none">
            Transfer to wallet{" "}
            {thisItemTransferIsPending && (
              <>
                <br />{" "}
                <span className="inline-block -mt-1 text-xs opacity-80">
                  ** You have an ongoing transfer for this item.
                </span>
              </>
            )}
          </span>

          <LoadingIndicator isLoading={transfer.isLoading} />
        </div>
      )}
      {/* <Modal {...{ isOpen, setIsOpen }}>
        <div className="text-lg">
          Under maintenance! Please try again later.
        </div>{" "}
      </Modal> */}

      <Modal {...{ isOpen, setIsOpen }}>
        <div className="mb-6">
          <span className="pb-2 font-semibold border-b-4 border-primary">
            Transfer to wallet
          </span>
        </div>
        {modalState == "init" && (
          <div>
            {" "}
            {!transfer.isLoading && (
              <h2 className="mb-4 text-3xl">
                Are you sure you want to transfer the item to your wallet?
              </h2>
            )}
            {transfer.isLoading && (
              <h2 className="mb-4 text-3xl">Starting item transfer out!</h2>
            )}
            <h3 className="text-2xl text-green">
              Item: {edition.edition_name} (Mint: #
              {formatMintNumber(params.item_id)})
            </h3>
            <div className="flex mt-6 md:space-x-6 phone:flex-col">
              <button
                disabled={transfer.isLoading}
                onClick={() => {
                  setModalState("confirmation");
                  transfer.reset();
                }}
              >
                Yes, I am sure{" "}
                <LoadingIndicator
                  className="inline-block ml-2"
                  isLoading={transfer.isLoading}
                />
              </button>
              {!transfer.isLoading && (
                <button
                  className="!bg-transparent border border-white"
                  onClick={(e) => setIsOpen(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
        {modalState == "confirmation" && (
          <>
            <div className="mb-4 text-lg">
              You are about to proceed to transfer the item to your wallet on
              the <span className="capitalize">{String(edition.network)}</span>{" "}
              network. You will be charged gas fees for this transaction. Your
              item will be locked in your account until the transaction
              completes.
            </div>
            <div className="mb-4 text-lg font-semibold text-red">
              CAUTION: Do not reject or cancel this transaction on Metamask. If
              you do so, your item will stay locked in your account.
            </div>
            <div className="flex mt-6 md:space-x-6 phone:flex-col">
              <button
                onClick={() => {
                  setModalState("init");
                  transfer.mutate();
                }}
              >
                Ok
              </button>
              <button
                className="!bg-transparent border border-white"
                onClick={() => {
                  setModalState("init");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {transfer?.error && (
          <div className="mt-3 text-xs font-semibold text-red">
            {transfer?.error}
          </div>
        )}
      </Modal>
    </>
  );
}
const formValidationSchema = (intl, editing) =>
  yup.object().shape({
    silent_auction: yup.boolean(),
    date: yup
      .string()
      .required(intl.formatMessage({ id: "forms.required_field_message" })),
    min_price: yup.lazy((value, schema) => {
      if (schema?.parent?.silent_auction) {
        return yup.mixed().notRequired();
      }
      if (value !== undefined) {
        return yup
          .mixed()
          .test(
            "min",
            "Minimum auction price is $1.",
            (value) => parseFloat(value) >= 1
          );
      } else {
        return yup
          .mixed()
          .required(intl.formatMessage({ id: "forms.required_field_message" }));
      }
    }),
    buy_now_price: yup.string().when("min_price", (min_price, schema) => {
      return schema.test({
        test: (buy_now_price) =>
          !buy_now_price || parseFloat(buy_now_price) >= parseFloat(min_price),
        message: "Buy Now Price must be more than min price.",
      });
    }),

    reserve_price: yup.lazy((value, schema) => {
      if (!value) {
        return yup.mixed().notRequired();
      } else {
        if (schema?.parent?.silent_auction) {
          return yup
            .mixed()
            .test("min", "Minimum reserve price is $1.", (value) => {
              return parseFloat(value) >= 1;
            });
        } else {
          return yup
            .mixed()
            .when("min_price", (min_price, schema) => {
              return schema.test({
                test: (reserve_price) =>
                  parseFloat(reserve_price) >= parseFloat(min_price),
                message: "Reserve price can't be smaller then minimum price!",
              });
            })
            .when("buy_now_price", (buy_now_price, schema) => {
              return schema.test({
                test: (reserve_price) =>
                  !buy_now_price ||
                  parseFloat(reserve_price) <= parseFloat(buy_now_price),
                message: "Reserve price must be smaller then buy price!",
              });
            });
        }
      }
    }),
  });
function PutItemForAuctionForm({ item, address }) {
  const action = useStartAuction(address);
  const intl = useIntl();

  const schema = formValidationSchema(intl);
  const silentRef = React.useRef(false);
  return (
    <Form
      schema={schema}
      onSubmit={async (values) => {
        const start_at = new Date().toUTCString();
        const end_at = new Date(values.date).toUTCString();

        action.mutateAsync({
          title: item.edition_name,
          item_id: Number(item.item_id),
          edition_id: item.edition_id,
          silent_auction: values.silent_auction,
          min_price: values.silent_auction
            ? 1
            : parseFloat(values.min_price) || 1,
          reserve_price: parseFloat(values.reserve_price),
          buy_now_price:
            !values.silent_auction && parseFloat(values.buy_now_price),
          end_at,
          start_at,
          is_fixed: false,
          crypto_enabled: true,
          stripe_enabled: true,
        });
      }}
    >
      {(form) => {
        const values = form.watch();
        if (silentRef.current !== values.silent_auction) {
          if (silentRef.current) {
            form.trigger();
          } else {
            form.trigger("reserve_price");
          }
          silentRef.current = values.silent_auction;
        }

        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 auto-rows-[minmax(50px,auto)]">
              <div className="md:col-span-2">
                <InputCheckbox name="silent_auction">
                  <div className="leading-4">
                    {" "}
                    Silent Auction <br />
                    <small className="text-xs opacity-80">
                      * In silent auctions users don't see other users bids.
                      There is no buy now option and bids can be made until the
                      auction time ends. Winner is displayed at the end of the
                      auction.
                    </small>
                  </div>{" "}
                </InputCheckbox>
              </div>
              <div className={cn({ hidden: values.silent_auction })}>
                <div className="flex items-center px-4 bg-white h-[50px]">
                  <span className="text-2xl font-semibold text-primary">$</span>{" "}
                  <InputPrice name="min_price" placeholder={"Minimum Bid"} />
                </div>
                <div className="mt-1">
                  <ErrorMessage name="min_price" />
                </div>
              </div>
              <div>
                <div className="flex items-center px-4 bg-white h-[50px]">
                  <span className="text-2xl font-semibold text-primary">$</span>{" "}
                  <InputPrice
                    name="reserve_price"
                    placeholder={"Reserve Price (optional)"}
                  />
                </div>
                <div className="mt-1">
                  <ErrorMessage name="reserve_price" />
                </div>
              </div>
              <div className={cn({ hidden: values.silent_auction })}>
                <div className="flex items-center px-4 bg-white h-[50px]">
                  <span className="text-2xl font-semibold text-primary">$</span>{" "}
                  <InputPrice
                    name="buy_now_price"
                    disabled={values.silent_auction}
                    placeholder={"Buy it Now Price (optional)"}
                  />
                </div>
                <div className="mt-1">
                  <ErrorMessage name="buy_now_price" />
                </div>
              </div>

              <div>
                <div className="flex items-center px-4 bg-white h-[50px]">
                  <span className="text-xl font-semibold text-primary">
                    <FaRegCalendarAlt />
                  </span>{" "}
                  <InputDate
                    showTimeSelect={true}
                    name="date"
                    type="date"
                    placeholder="Auction Expiration*"
                  />
                </div>
                <div className="mt-1">
                  <ErrorMessage name="date" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <SubmitButton className="space-x-2" disabled={action.isLoading}>
                <span>Done</span>{" "}
                <LoadingIndicator isLoading={action.isLoading} />
              </SubmitButton>
            </div>
            {action.isError && (
              <div className="mt-3 font-semibold text-center text-red">
                {action?.error?.message ?? action?.error}
              </div>
            )}
          </>
        );
      }}
    </Form>
  );
}

function ProductInformation({ edition }) {
  return (
    <div className="py-8">
      <div>
        <h2 className="flex items-center text-xl">
          <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
          Product Information:
        </h2>
        <div className="grid grid-cols-[auto,1fr] md:grid-cols-[2fr,3fr,2fr,3fr] gap-x-3 gap-y-2 mt-8">
          <div className="contents">
            <span>Network</span>
            <span className="capitalize">{edition?.network}</span>
          </div>
          <div className="contents">
            <span>Total</span>
            <span>{edition.total_minted}</span>
          </div>
          <div className="contents">
            <span>Release Date:</span>
            <span>{edition.distribution_start}</span>
          </div>

          <div className="contents">
            <span>Publisher:</span>
            <span>{edition.publisher_name}</span>
          </div>
          <div className="contents">
            <span>Lowest Ask:</span>
            <span>{formatPrice(edition.lowest_ask)}</span>
          </div>
          <div className="contents">
            <span>Game:</span>
            <span>{edition.app_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function ItemInformation({ params }) {
  const { data: item, isLoading } = useUsersItem(
    params.edition_id,
    params.item_id
  );
  return (
    <div className="py-8">
      <div>
        <h2 className="flex items-center text-xl">
          <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
          Item information:
        </h2>
        <LoadingIndicator isLoading={isLoading || !item} />
        {!isLoading && item && (
          <div className="grid grid-cols-[auto,1fr] gap-x-10 gap-y-2 mt-8">
            <div className="contents">
              <span>Mint#:</span>
              <span>
                {formatMintNumber(item.item_id)} of {item.minted}
              </span>
            </div>

            <div className="contents">
              <span>Purchase Price:</span>
              <span>
                {formatPrice(
                  item.platform === "metamask"
                    ? item?.eth_amount
                    : item?.amount,
                  item.platform === "metamask" ? "ETH" : undefined
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ItemHistory({ params }) {
  const { data: item, isLoading } = useUsersItem(
    params.edition_id,
    params.item_id
  );
  return (
    <div className="py-8">
      <div>
        <h2 className="flex items-center text-xl">
          <span className="bg-primary inline-block w-5 h-[7px] mr-2.5"></span>{" "}
          Item History:
        </h2>
        <LoadingIndicator isLoading={isLoading || !item} />
        <HistoryTable history={item?.history} />
      </div>
    </div>
  );
}

function HistoryTable({ history }) {
  return (
    <>
      <div className="mt-4">
        {history?.length === 0 && <p>No item history</p>}
        <ul className="divide-y divide-white/20">
          {history?.map((item) => {
            return (
              <li key={item.id} className="py-4">
                <div className="flex space-x-3">
                  {item.status == "purchased" && item.auction_id !== "0" ? (
                    <RiAuctionFill
                      className="w-6 h-6 p-1 text-black rounded-full bg-green"
                      aria-hidden="true"
                    />
                  ) : (
                    <FaDollarSign
                      className="w-6 h-6 p-1 text-black rounded-full bg-green"
                      aria-hidden="true"
                    />
                  )}
                  {item.status == "pending" && (
                    <BsThreeDots
                      className="w-6 h-6 p-1 text-black rounded-full bg-yellow"
                      aria-hidden="true"
                    />
                  )}
                  {item.status == "canceled" && (
                    <MdClose
                      className="w-6 h-6 p-1 text-black rounded-full bg-red"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex-1 space-y-2 md:space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="space-x-2 text-sm font-medium">
                        <span>{formatDate(item.purchase_date)} </span>
                        <MdKeyboardArrowRight className="inline-block" />{" "}
                        <span>
                          Price:{" "}
                          {item.platform === "metamask"
                            ? formatPrice(parseFloat(item.eth_amount), "ETH")
                            : formatPrice(parseFloat(item.amount))}
                        </span>
                      </h3>
                      <p className="hidden text-sm md:block">
                        <OrderStatusBadge order={item} />
                      </p>
                    </div>
                    <p className=" text-white/60">
                      <span className="text-sm md:hidden">
                        <OrderStatusBadge order={item} />
                      </span>{" "}
                      {item.auction_id !== "0" && (
                        <Link
                          to={`/marketplace/auction/${item.auction_id}`}
                          className="text-yellow/80"
                        >
                          Purchased on auction.{" "}
                          <span className="underline">[ see details ]</span>
                          <br />
                        </Link>
                      )}
                      {item.auction_id == "0" && (
                        <span className="text-yellow/80">
                          Purchased from Epik. <br />
                        </span>
                      )}
                      <div className="text-sm">
                        Platform:{" "}
                        <span className="capitalize">{item.platform}</span>
                      </div>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
