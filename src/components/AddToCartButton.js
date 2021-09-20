import useAuth from "@api/useAuth";
import useCart from "@api/useCart";

import { useCollection, useEdition } from "@api/useItems";
import formatPrice from "@utils/formatPrice";
import { navigate } from "gatsby-link";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import useIsLocked from "@api/useIsLocked";
import { usePurchases } from "@api/useProfile";

export default function AddToCartButton({
  item,
  hidePrice = false,
  className = "",
  icon = null,
  ...rest
}) {
  const { edition, isLoading } = useEdition(item.edition_id);
  const cart = useCart();
  const isLocked = useIsLocked(edition);
  const { data: eligibility } = usePurchases((data) =>
    data?.eligibility?.find((e) => e.edition_id == edition?.edition_id)
  );

  const invisible = edition.sold_out && parseInt(edition.edition_id) > 30;

  const ownsEligibilityItem = eligibility?.message == "user already bought";
  if (invisible) {
    return null;
  }
  return (
    <>
      {" "}
      {edition.publishing_status === "published" && (
        <button
          className={` text-sm   !min-w-0 inline-block mr-8 space-x-2 ${className}`}
          {...rest}
          disabled={edition.sold_out || isLocked || isLoading}
          onClick={() => {
            cart.isItemInCart(edition)
              ? navigate("/marketplace/cart")
              : cart.addItem(edition);
          }}
        >
          <span className="inline-flex items-center space-x-2">
            {(isLocked || ownsEligibilityItem) && (
              <span>
                {!ownsEligibilityItem && <FormattedMessage id="locked" />}
                {ownsEligibilityItem && (
                  <FormattedMessage id="item.user_already_bought" />
                )}
              </span>
            )}
            {!isLocked && (
              <>
                {" "}
                {edition.sold_out ? (
                  <FormattedMessage id="not_available" />
                ) : cart.isItemInCart(edition) ? (
                  <>
                    {icon}{" "}
                    <span>
                      <FormattedMessage id="checkout" />
                    </span>{" "}
                  </>
                ) : (
                  <>
                    {icon}{" "}
                    <span>
                      <FormattedMessage id="add_to_cart" />
                    </span>{" "}
                  </>
                )}
              </>
            )}
          </span>
          <span className="opacity-70">
            {edition.sold_out || hidePrice
              ? ""
              : cart.isItemInCart(edition)
              ? ""
              : formatPrice(edition.token_price)}
          </span>
        </button>
      )}
    </>
  );
}
