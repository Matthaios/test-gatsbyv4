import React from "react";

export default function hideAuctionItems(item) {
  return true;
  // return (
  //   parseFloat(item.token_price) > 0 ||
  //   (parseFloat(item.token_price) === 0 && parseInt(item.edition_id) < 20)
  // );
}
