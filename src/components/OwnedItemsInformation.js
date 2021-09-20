import React from "react";
import { Link } from "gatsby";

import useAuth from "@api/useAuth";
import { usePurchases } from "@api/useProfile";
import formatMintNumber from "@utils/formatMintNumber";

export default function OwnedItemsInformation({ editionId }) {
  const { purchases } = usePurchases();
  if (!purchases) {
    return null;
  }

  const ownedItems = purchases
    ?.filter((i) => i.edition_id == editionId)
    .sort((a, b) => {
      return parseInt(b) > parseInt(a) ? 1 : -1;
    });
  if (ownedItems?.length === 0) {
    return null;
  } else {
    return (
      <div className="pt-4">
        You own mint{" "}
        <Link
          to={`/marketplace/profile/items/${editionId}/${ownedItems?.[0]?.item_id}`}
          className="font-semibold text-primary-light hover:underline"
        >
          #{formatMintNumber(ownedItems?.[0]?.item_id)}
        </Link>{" "}
        {ownedItems?.length > 1 && (
          <>
            {" "}
            and{" "}
            <Link
              className="font-semibold text-primary-light hover:underline"
              to={`/marketplace/profile/items?id=${editionId}`}
            >
              {ownedItems.length - 1} other{ownedItems.length > 2 ? "s" : ""}
            </Link>
          </>
        )}
      </div>
    );
  }
}
