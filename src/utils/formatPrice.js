//@ts-check

import React from "react";
import LoadingIndicator from "@components/LoadingIndicator";

/**
 *
 * @param {string|number} amount
 * @param {string} currency
 * @param {string} lang
 * @returns {string}
 */
export default function formatPrice(amount, currency = "USD", lang = "en-US") {
  if (!amount && amount !== 0) {
    return "";
  }
  switch (currency) {
    case "ETH":
      return parseFloat(amount).toFixed(4) + " ETH";
    default:
      return new Intl.NumberFormat(lang, {
        style: "currency",
        currency,
      }).format(amount);
  }
}
/**
 *
 * @param {number} amount
 * @param {object} oracle
 * @param {number} fixed
 * @returns
 */
export function usdToEth(amount, oracle, fixed = 4) {
  return (
    <>
      <LoadingIndicator isLoading={oracle.isLoading} />
      {oracle?.data && <>{(amount / oracle?.data?.price).toFixed(fixed)}</>}
    </>
  );
}
