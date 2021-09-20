import { navigate } from "gatsby";
import React from "react";
import Icon from "@images/no-favourite-items.png";

export default function NoItemsMessage() {
  return (
    <div className="container max-w-4xl text-center pb-20 pt-12 lg:pt-32 lg:pb-40">
      <img src={Icon} className="mx-auto" />
      <div className="prose mt-8">
        <h2>You did not have any item</h2>
        <p>
          ßßß The purpose of lorem ipsum is to create a natural looking block of
          text (sentence, paragraph, page, etc.) that doesn't distract from the
          layout. A practice not without controversy, laying out pages with
          meaningless filler text can be very useful when.
        </p>
        <button
          className="button mt-8"
          onClick={() => navigate(`/marketplace`)}
        >
          Browse Items
        </button>
      </div>
    </div>
  );
}
