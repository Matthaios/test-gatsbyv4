import { useEdition } from "@api/useItems";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import React from "react";
import { CardImage } from "./Card";
import LoadingIndicator from "./LoadingIndicator";
import MediaSlider from "./MediaSlider";

export default function EditionCard({ edition_id, item_id }) {
  const { edition, isLoading } = useEdition(edition_id);

  return (
    <div className="p-8 rounded-sm bg-primary-dark">
      {" "}
      <LoadingIndicator isLoading={isLoading} />
      {edition && (
        <>
          <CardImage data={edition} />

          <div className="mt-8">
            <h2 className="text-xl ">
              {edition.edition_name} #{formatMintNumber(item_id)}
            </h2>
            <div>
              <div className="grid grid-cols-[auto,1fr]  gap-x-3 gap-y-2 mt-2">
                <div className="contents">
                  <span>Total</span>
                  <span>{edition.total_minted}</span>
                </div>
                <div className="contents">
                  <span>Release Date:</span>
                  <span>{edition.distribution_start}</span>
                </div>

                <div className="contents">
                  <span>Publisher:</span>
                  <span>{edition.publisher_name}</span>
                </div>
                <div className="contents">
                  <span>Epik price:</span>
                  <span>{formatPrice(edition.token_price)}</span>
                </div>
                <div className="contents">
                  <span>Game:</span>
                  <span>{edition.app_name}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function Image({ edition_id }) {
  const { edition, isLoading } = useEdition(edition_id);
  if (isLoading) {
    return <LoadingIndicator isLoading />;
  }

  return edition ? <CardImage data={edition} /> : null;
}

function Details({ edition_id, item_id, ...rest }) {
  const { edition, isLoading } = useEdition(edition_id);
  if (isLoading) {
    return <LoadingIndicator isLoading />;
  }

  return edition ? (
    <div {...rest}>
      <h2 className="text-2xl ">
        {edition.edition_name} #{formatMintNumber(item_id)}
      </h2>
      <div>
        <div className="grid grid-cols-[auto,1fr]  gap-x-3 gap-y-2 mt-2">
          <div className="contents">
            <span>Total</span>
            <span>{edition.total_minted}</span>
          </div>
          <div className="contents">
            <span>Release Date:</span>
            <span>{edition.distribution_start}</span>
          </div>

          <div className="contents">
            <span>Publisher:</span>
            <span>{edition.publisher_name}</span>
          </div>
          <div className="contents">
            <span>Epik price:</span>
            <span>{formatPrice(edition.token_price)}</span>
          </div>
          <div className="contents">
            <span>Game:</span>
            <span>{edition.app_name}</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

EditionCard.Image = Image;
EditionCard.Details = Details;
