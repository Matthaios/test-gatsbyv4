import useAuth from "@api/useAuth";
import useCart, { useMetamask, useStripe } from "@api/useCart";
import useAllEditions, { useEdition } from "@api/useItems";
import { useOracle } from "@api/useOracle";
import { isMetamaskInstalled } from "@api/useWeb3";
import { CardImage } from "@components/Card";
import InstallMetamask from "@components/InstallMetamask";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import Divider from "@components/Divider";
import { css } from "@emotion/react";
import Icon from "@images/no-items-icon.png";
import formatPrice, { usdToEth } from "@utils/formatPrice";
import turnErrorToString from "@utils/turnErrorToString";
import useWeb3Modal from "@utils/web3modal";
import BigNumber from "bignumber.js";
import { Link, navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import tw from "twin.macro";

export default function Cart() {
  // const web3 = useWeb3(false);
  const { onConnect, conState } = useWeb3Modal();
  const [metamaksInstallModal, setMetamaskInstallModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { user } = useAuth();
  const oracle = useOracle();
  const cart = useCart();
  const stripe = useStripe();
  const metamask = useMetamask();
  const editions = useAllEditions();
  const sumTotalCash = () => {
    let total = cart?.data
      ?.filter((i) => !i.sold_out)
      ?.reduce((total, item) => {
        return total + parseFloat(item.token_price);
      }, 0);
    return total ?? 0;
  };

  useEffect(() => {
    if (editions.isLoading || cart.isLoading) {
      return;
    }
    const checks = cart?.data?.map((item) => {
      const id = item.edition_id;
      const edition = editions?.data?.find((e) => e.edition_id == id);
      return edition?.sold_out;
    });
    if (checks?.includes(true)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [editions.data, cart.data]);
  const sumTotalCrypto = () => {
    let total = cart?.data
      ?.filter((i) => !i.sold_out)
      ?.reduce((total, item) => {
        return total + parseFloat(item.token_price);
      }, 0);
    return oracle?.data?.price > 0
      ? new BigNumber(total).dividedBy(new BigNumber(oracle?.data?.price))
      : 0;
  };

  if (cart.isLoading) {
    return <LoadingIndicator isLoading={true} robot />;
  }

  return (
    <Layout>
      <div className="hero-spacer"></div>
      {Boolean(cart?.data?.length) ? (
        <>
          {" "}
          <div
            className="container grid gap-10 py-16 lg:gap-16"
            css={css`
              @media (min-width: 1024px) {
                grid-template-columns: 2fr 1fr;
              }
              @media (min-width: 1280px) {
                grid-template-columns: 1fr 414px;
              }
            `}
          >
            <div>
              <h2 className="mb-8 text-3xl font-semibold">
                {cart?.data?.length}{" "}
                {cart?.data?.length === 1 ? (
                  <FormattedMessage id="cart.item" />
                ) : (
                  <FormattedMessage id="cart.items" />
                )}{" "}
                <FormattedMessage id="cart.in_my_cart" />
              </h2>
              <div>
                <table className="w-full table-auto">
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
                      <th></th>
                      <th className="text-center">
                        <FormattedMessage id="cart.item" />{" "}
                      </th>
                      <th className="phone:hidden">Network</th>
                      <th className="phone:hidden">
                        <FormattedMessage id="cart.price" />
                      </th>
                      <th>
                        <div className="inline-block">
                          <FormattedMessage id="cart.remove" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white divide-opacity-25 ">
                    {cart.data &&
                      cart.data.map((item) => <CartLine edition={item} />)}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              {cart?.data?.length ? (
                <div className="bg-primary-dark">
                  <div className="p-10 ">
                    <h3 className="mb-8 text-3xl font-semibold">
                      <FormattedMessage id="cart.summary" />
                    </h3>
                    <div className="flex justify-between xl:text-lg">
                      <strong className="inline-block mr-2 font-semiboldc">
                        <FormattedMessage id="cart.subtotal" />
                      </strong>
                      <span className="inline-block ml-auto leading-5 text-right">
                        {formatPrice(sumTotalCash())}
                        <br />
                        {usdToEth(sumTotalCash(), oracle, 4)} ETH
                      </span>
                    </div>
                  </div>
                  <Divider />
                  <div className="p-10">
                    <div className="flex justify-between xl:text-lg">
                      <strong className="font-semibold">
                        <FormattedMessage id="cart.total_price" />:
                      </strong>
                      <span className="inline-block ml-auto leading-5 text-right">
                        {formatPrice(sumTotalCash())} <br />
                        {usdToEth(sumTotalCash(), oracle, 4)} ETH
                      </span>
                    </div>
                    <div className="mt-8 text-sm opacity-80">
                      **Prices shown in Eth are estimates only
                    </div>
                    <button
                      className="w-full mt-8 space-x-2 button"
                      disabled={
                        stripe.isLoading || isDisabled || editions.isLoading
                      }
                      onClick={() => {
                        if (user) {
                          stripe.mutate(
                            cart.data
                              .filter((e) => !e.sold_out)
                              .map((e) => e.edition_id)
                          );
                        } else {
                          navigate(
                            "/marketplace/login?redirect=/marketplace/cart"
                          );
                        }
                      }}
                    >
                      <span>
                        {" "}
                        <FormattedMessage id="cart.buy_with_credit_card" />
                      </span>{" "}
                      <LoadingIndicator
                        isLoading={stripe.isLoading || editions.isLoading}
                      />
                    </button>
                    <button
                      className="w-full mt-4 space-x-2 button"
                      disabled={
                        sumTotalCrypto() <= 0 ||
                        isDisabled ||
                        editions.isLoading
                      }
                      onClick={async () => {
                        if (!isMetamaskInstalled) {
                          setMetamaskInstallModal(true);
                          return;
                        }
                        let { address, web3 } = conState;

                        if (!address || !web3) {
                          const res = await onConnect();
                          address = res.address;
                          web3 = res.web3;
                        }

                        if (user && address) {
                          await metamask.mutateAsync({
                            web3,
                            account: address,
                            userId: user.user_id,
                            cartData: cart.data.filter((e) => !e.sold_out),
                            total: sumTotalCrypto(),
                            totalUSD: cart?.data
                              .filter((e) => !e.sold_out)
                              ?.map((item) => item.token_price),
                          });
                        } else {
                          navigate(
                            "/marketplace/login?redirect=/marketplace/cart"
                          );
                        }
                      }}
                    >
                      <span>
                        {" "}
                        <FormattedMessage id="cart.buy_with_metamask" />
                      </span>

                      <LoadingIndicator
                        isLoading={metamask.isLoading || editions.isLoading}
                      />
                    </button>{" "}
                    {!editions.isLoading && isDisabled && (
                      <div className="mt-4 text-sm text-center text-red">
                        Please remove items that are not available
                      </div>
                    )}
                    {metamask.isError && (
                      <div className="mt-4 text-sm font-semibold text-red">
                        {turnErrorToString(metamask.error)}
                      </div>
                    )}
                    {stripe.isError && (
                      <div className="mt-4 text-sm font-semibold text-red">
                        {turnErrorToString(stripe.error)}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="container max-w-4xl pt-12 pb-20 text-center lg:pt-32 lg:pb-40">
          <img src={Icon} className="mx-auto" />
          <div className="mt-8 prose">
            <h2>
              <FormattedMessage id="cart.your_cart_is_empty" />
            </h2>
            <p>
              <FormattedMessage id="cart.empty_message" />
            </p>
            <Link to="/marketplace" className="mt-8 button">
              <FormattedMessage id="cart.go_to_marketplace" />
            </Link>
          </div>
        </div>
      )}
      <InstallMetamask
        open={metamaksInstallModal}
        onClose={() => setMetamaskInstallModal(false)}
      />
    </Layout>
  );
}

function CartLine({ edition }) {
  const { data, isLoading } = useEdition(edition?.edition_id);

  const cart = useCart();
  const oracle = useOracle();
  return (
    <tr
      key={edition?.edition_id}
      className={data?.sold_out ? "opacity-30" : ""}
    >
      <td className="w-16 py-4 text-center">
        <CardImage data={edition} className="w-16 h-16 " />
      </td>
      <td className="text-center">
        {edition?.edition_name}
        <div className="hidden text-sm tracking-wide phone:block">
          <div>
            <span className="inline-block ml-4">
              <FormattedMessage id="cart.price" />:
              <span className="font-semibold ">
                {isLoading ? (
                  <LoadingIndicator isLoading />
                ) : data?.sold_out ? (
                  <span className="uppercase ">Sold out</span>
                ) : (
                  <>
                    {" "}
                    {formatPrice(edition?.token_price)} /{" "}
                    {usdToEth(edition?.token_price, oracle)} ETH
                  </>
                )}
              </span>
            </span>
          </div>
        </div>
      </td>
      <td className="font-semibold text-center capitalize phone:hidden">
        {edition?.network}
      </td>
      <td className="font-semibold text-center phone:hidden">
        {data?.sold_out ? (
          <span className="uppercase ">Not available</span>
        ) : (
          <>
            {" "}
            {formatPrice(edition?.token_price)} /{" "}
            {usdToEth(edition?.token_price, oracle)} ETH
          </>
        )}
      </td>
      <td className="text-center">
        <MdClose
          className="inline-block w-5 h-5"
          style={{ cursor: "pointer" }}
          onClick={() => cart.removeItem(edition)}
        />
      </td>
    </tr>
  );
}
