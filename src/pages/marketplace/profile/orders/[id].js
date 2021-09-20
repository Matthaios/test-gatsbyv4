import useAuth from "@api/useAuth";
import useCart from "@api/useCart";
import { useOracle } from "@api/useOracle";
import { useOrder } from "@api/useOrders";
import { CardImage } from "@components/Card";
import LoadingIndicator from "@components/LoadingIndicator";
import OrderStatusBadge from "@components/OrderStatusBadge";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import Truncate from "@components/Truncate";
import { css } from "@emotion/react";
import formatDate from "@utils/formatDate";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import { Link } from "gatsby";
import React from "react";
import { MdPrint } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import tw from "twin.macro";

export default function Order({ params }) {
  const cart = useCart();
  const orders = useOrder(params.id);
  const { user } = useAuth();
  const oracle = useOracle();

  const sumTotalCash = () => {
    let total = orders?.data?.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);
    return total ?? 0;
  };

  const sumTotalCrypto = () => {
    let total = orders?.data?.reduce((total, item) => {
      return total + parseFloat(item.ethAmount);
    }, 0);
    return total ?? 0;
  };

  const order = orders?.data?.[0];
  if (!order || orders?.data?.length == 0) {
    return (
      <ProfileSubPagesLayout>
        {" "}
        <LoadingIndicator robot isLoading={true} />
      </ProfileSubPagesLayout>
    );
  }

  return (
    <ProfileSubPagesLayout
      breadcrumbs={{ label: `Order ID: ${params.id?.toUpperCase()}` }}
    >
      <div className="pb-12 ">
        {/* <h3 className="mb-10 text-lg">Order ID: {params.id}</h3> */}
        <div
          className="grid min-w-full gap-10 lg:gap-16 "
          css={css`
            @media print {
              * {
                color: #000 !important;
              }
            }
            @media (min-width: 1024px) {
              grid-template-columns: 1fr 1fr;
            }
            @media (min-width: 1280px) {
              grid-template-columns: 1fr 1fr;
            }
          `}
        >
          <div>
            {" "}
            <div>
              <table className="w-full table-fixed">
                <thead
                  className="bg-primary-dark"
                  css={css`
                    th,
                    td {
                      ${tw`px-2 py-4 text-center`};
                    }
                  `}
                >
                  <tr>
                    <th className="w-16"></th>
                    <th className="text-center">
                      {" "}
                      <FormattedMessage id="cart.item" />
                    </th>
                    <th className="text-center">
                      {" "}
                      <FormattedMessage id="item.mint" />{" "}
                    </th>
                    <th className="text-center">
                      {" "}
                      <FormattedMessage id="item.network" />{" "}
                    </th>

                    <th className="phone:hidden w-36">
                      <FormattedMessage id="cart.price" />{" "}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white divide-opacity-25 ">
                  {orders.data &&
                    orders.data.map((item) => (
                      <Link
                        to={`/marketplace/profile/items/${item.editionId}/${item.itemId}`}
                        key={item.editionId}
                        className="table-row align-middle group"
                      >
                        <td className="w-16 py-4 text-center">
                          {item.item && (
                            <CardImage data={item.item} className="w-16 h-16" />
                          )}
                        </td>
                        <td className="text-center group-hover:font-bold">
                          {item?.item?.edition_name}
                          <div className="hidden text-sm tracking-wide phone:block">
                            <div>
                              <span className="inline-block ml-4">
                                <span className="font-semibold ">
                                  {order.paymentGateway === "metamask" ? (
                                    <>
                                      <Truncate
                                        length={8}
                                        text={item.ethAmount}
                                      />
                                      ETH
                                    </>
                                  ) : (
                                    formatPrice(item.amount)
                                  )}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold text-center">
                          {formatMintNumber(item.itemId)}
                        </td>{" "}
                        <td className="font-semibold text-center capitalize ">
                          {item?.item?.network}
                        </td>
                        <td className="font-semibold text-center phone:hidden w-36">
                          {order.paymentGateway === "metamask" ? (
                            <>
                              {" "}
                              <Truncate length={8} text={item.ethAmount} />
                              ETH
                            </>
                          ) : (
                            formatPrice(item.amount)
                          )}
                        </td>
                      </Link>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:max-w-xl">
            {orders?.data?.length ? (
              <div className="bg-primary-dark">
                <div className="p-10 space-y-6 text-lg ">
                  <h3 className="flex items-baseline justify-between mb-8 text-3xl font-semibold">
                    {" "}
                    <FormattedMessage id="cart.summary" />{" "}
                    {order?.status == "purchased" && (
                      <a
                        href={"/functions/invoice?purchaseId=" + params.id}
                        target="_blank"
                        className="space-x-2 text-lg uppercase cursor-pointer hover:text-green opacity-70"
                      >
                        <MdPrint className="inline" />
                        <span className="text-base ">Invoice</span>{" "}
                      </a>
                    )}
                  </h3>
                  <div className="grid grid-cols-[auto,1fr] gap-4 justify-between">
                    <div className="contents ">
                      <strong className="font-semibold">
                        {" "}
                        <FormattedMessage id="cart.total" />{" "}
                      </strong>
                      <span className="inline-block ml-auto">
                        {order.paymentGateway === "metamask" ? (
                          <>
                            <Truncate length={8} text={sumTotalCrypto()} />
                            ETH
                          </>
                        ) : (
                          formatPrice(sumTotalCash())
                        )}{" "}
                      </span>
                    </div>
                    <div className="contents ">
                      <strong className="font-semibold">
                        {" "}
                        <FormattedMessage id="orders.platform" />{" "}
                      </strong>
                      <span className="inline-block ml-auto capitalize">
                        {order.paymentGateway == "stripe"
                          ? "Credit Card"
                          : order.paymentGateway}
                      </span>
                    </div>
                    <div className="contents ">
                      <strong className="font-semibold">
                        {" "}
                        <FormattedMessage id="date" />{" "}
                      </strong>
                      <span className="inline-block ml-auto capitalize">
                        {formatDate(order.purchase_date)}
                      </span>
                    </div>
                    <div className="contents print:hidden">
                      <strong className="font-semibold">
                        {" "}
                        <FormattedMessage id="orders.status" />{" "}
                      </strong>
                      <div className="text-right">
                        <OrderStatusBadge order={order} />
                      </div>
                    </div>
                  </div>
                  <div className="print:hidden">
                    {order.paymentGateway == "metamask" && (
                      <p className="mb-3 break-words">
                        <span className="text-green">Transaction id:</span>{" "}
                        <div>
                          <Truncate length={20} text={order.transaction_hash} />
                        </div>
                      </p>
                    )}
                    <p>
                      <FormattedMessage id="orders.view_item_in_profile" />
                    </p>

                    <Link
                      className="mt-4 button"
                      to="/marketplace/profile/items"
                    >
                      <FormattedMessage id="my_items" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ProfileSubPagesLayout>
  );
}
