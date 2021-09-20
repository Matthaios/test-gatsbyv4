import useCart from "@api/useCart";
import { useOrder } from "@api/useOrders";
import { CardImage } from "@components/Card";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import OrderStatusBadge from "@components/OrderStatusBadge";
import Truncate from "@components/Truncate";
import { css } from "@emotion/react";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import { Link } from "gatsby";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useQueryClient } from "react-query";
import tw from "twin.macro";

export default function Success({ params }) {
  const queryClient = useQueryClient();
  const cart = useCart();
  const orders = useOrder(params.id);

  useEffect(() => {
    queryClient.invalidateQueries("all-items");
    if (cart.isSuccess) {
      cart.reset();
    }
  }, [cart.isSuccess]);
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
  if (!orders?.data) {
    return (
      <Layout>
        {" "}
        <LoadingIndicator robot isLoading={true} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="container py-20">
        <div className="mx-auto prose text-center">
          <h1>
            <FormattedMessage id="orders.thanks_for_order" />
          </h1>
          <h3 className="opacity-80  !mt-0">
            <FormattedMessage id="orders.check_order_status" />
          </h3>
          <p className="space-x-4 text-lg opacity-80">
            <strong className="font-semibold">
              <FormattedMessage id="orders.order_id" />:
            </strong>
            <span
              className="inline-block ml-auto text-right uppercase "
              style={{ wordWrap: "anywhere" }}
            >
              {params.id}
            </span>
          </p>
        </div>
        <LoadingIndicator robot isLoading={orders?.data?.length == 0} />
        {orders?.data?.length > 0 && (
          <div
            className="grid gap-10 py-16 lg:gap-16"
            css={css`
              @media (min-width: 1024px) {
                grid-template-columns: 1fr 1fr;
              }
              @media (min-width: 1280px) {
                grid-template-columns: 1fr 1fr;
              }
            `}
          >
            <div>
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
                        <FormattedMessage id="cart.item" />{" "}
                      </th>
                      <th className="text-center">
                        {" "}
                        <FormattedMessage id="orders.mint" />
                      </th>
                      <th className="text-center">
                        {" "}
                        <FormattedMessage id="item.network" />
                      </th>

                      <th className="phone:hidden w-36">
                        <FormattedMessage id="cart.price" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white divide-opacity-25 ">
                    {orders.data &&
                      orders.data.map((item) => (
                        <Link
                          to={`/marketplace/profile/items/${item.editionId}/${item.itemId}`}
                          key={item.edition_id}
                          className="table-row align-middle group "
                        >
                          <td className="w-16 py-4 text-center">
                            <CardImage data={item.item} className="w-16 h-16" />
                          </td>
                          <td className="text-center group-hover:font-bold w-36">
                            {item.item.edition_name}
                            <div className="hidden text-sm tracking-wide phone:block">
                              <div>
                                <span className="inline-block ml-4">
                                  <span className="font-semibold ">
                                    {order.paymentGateway === "stripe" ? (
                                      formatPrice(item.amount)
                                    ) : (
                                      <>
                                        <Truncate
                                          length={8}
                                          text={item.ethAmount}
                                        />
                                        ETH
                                      </>
                                    )}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="font-semibold text-center ">
                            {formatMintNumber(item.itemId)}
                          </td>
                          <td className="font-semibold text-center capitalize ">
                            {item?.item?.network}
                          </td>
                          <td className="font-semibold text-center phone:hidden">
                            {order.paymentGateway === "stripe" ? (
                              formatPrice(item.amount)
                            ) : (
                              <>
                                <Truncate length={8} text={item.ethAmount} />
                                ETH
                              </>
                            )}
                          </td>
                        </Link>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              {orders?.data?.length ? (
                <div className="bg-primary-dark">
                  <div className="p-10 space-y-6 ">
                    <h3 className="mb-8 text-3xl font-semibold">
                      <FormattedMessage id="cart.summary" />
                    </h3>
                    <div className="grid grid-cols-[auto,1fr] gap-4">
                      <div className="contents">
                        <strong className="font-semibold">
                          <FormattedMessage id="cart.total" />
                        </strong>
                        <span className="inline-block ml-auto">
                          {order.paymentGateway === "stripe" ? (
                            formatPrice(sumTotalCash())
                          ) : (
                            <>
                              {" "}
                              <Truncate length={8} text={sumTotalCrypto()} />
                              ETH
                            </>
                          )}
                        </span>
                      </div>

                      <div className="contents">
                        <strong className="font-semibold">
                          <FormattedMessage id="orders.platform" />
                        </strong>
                        <span className="inline-block ml-auto capitalize">
                          {order.paymentGateway == "stripe"
                            ? "Credit Card"
                            : order.paymentGateway}
                        </span>
                      </div>
                      <div className="contents">
                        <strong className="font-semibold">
                          {" "}
                          <FormattedMessage id="orders.status" />
                        </strong>
                        <div className="text-right">
                          <OrderStatusBadge order={order} />
                        </div>
                      </div>
                    </div>
                    {order.status === "purchased" && (
                      <div>
                        <p>
                          <FormattedMessage id="orders.success_message" />
                        </p>
                        <Link
                          className="mt-4 button"
                          to="/marketplace/profile/items"
                        >
                          <FormattedMessage id="redeem.my_items" />
                        </Link>
                      </div>
                    )}
                    {order.paymentGateway == "metamask" &&
                      order.status !== "purchased" && (
                        <p>
                          Metamask transactions will go through verification
                          process after the transaction ends. Once it's verified
                          you will get a status update.
                        </p>
                      )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
