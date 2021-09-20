import React, { useEffect } from "react";

import differenceInSeconds from "date-fns/differenceInSeconds";
export default {
  getStage,
};

function getStage(auction) {
  if (!auction) {
    return undefined;
  }
  const end = new Date(auction.end_at);
  const diffInSeconds = differenceInSeconds(end, new Date());
  const processing = Boolean(diffInSeconds < 1 && !auction.completed);

  if (processing) {
    return "processing";
  }
  if (!auction.completed) {
    return "ongoing";
  }
  if (!auction.succeed) {
    return "ended";
  }
  if (auction.purchase_id) {
    return "ended";
  }
  if (!auction.purchase_id) {
    return "waiting";
  }
}
