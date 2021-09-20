import React from "react";
import { useMutation } from "react-query";
import LoadingIndicator from "./LoadingIndicator";

export default function SpeedUpAuction({ auction_id }) {
  const mutation = useMutation(async () => {
    return fetch(
      `${process.env.GATSBY_API_URL}/item/speed-up-auction/${auction_id}`
    );
  });
  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Speed up <LoadingIndicator isLoading={mutation.isLoading} />
      </button>
    </div>
  );
}
