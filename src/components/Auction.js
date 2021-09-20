import auctionUtils from "@utils/auctionUtils";
import React from "react";
import Countdown from "@components/Countdown";
import cn from "classnames";
export default function Auction() {
  return null;
}

Auction.Timer = Timer;

export function Timer({ auction, labels, className, highlight }) {
  return (
    <Countdown date={auction.end_at}>
      {(time, isEnded) => {
        const stage = auctionUtils.getStage(auction);
        return (
          <span
            className={cn("px-2 font-semibold", {
              "bg-red/20 text-red": stage == "ended",
              "bg-yellow/20 text-yellow":
                stage == "waiting" || stage == "processing",
              "bg-green/20 text-green": stage == "ongoing" && highlight,
            })}
          >
            {!isEnded && (labels?.ongoing || time)}
            {isEnded && (
              <>
                {stage == "waiting" &&
                  (labels?.waiting || "Waiting for winner")}{" "}
                {stage == "ended" && (labels?.ended || "Ended")}
                {stage == "processing" && (labels?.processing || "Processing")}
              </>
            )}
          </span>
        );
      }}
    </Countdown>
  );
}
