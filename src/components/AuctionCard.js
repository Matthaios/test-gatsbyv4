import React from "react";

import GatsbyImage from "gatsby-background-image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import get from "lodash/get";
import useCart from "@api/useCart";
import { Link, navigate } from "gatsby";
import AddToCartButton from "./AddToCartButton";
import formatPrice from "@utils/formatPrice";

export default function AuctionCard({ item, data }) {
  return (
    data && (
      <Link to={`/marketplace/auction/${item.id}`}>
        <GatsbyImage
          fluid={[`url("${data.item_gif_url || data.item_image_url}")`]}
        >
          <div className="h-56 relative">
            <span className="font-semibold absolute bottom-2 right-4 ">
              {item.buy_now_price != 999999 ? formatPrice(item.buy_now_price) : ""}
            </span>
          </div>
        </GatsbyImage>
        <div className="mt-6 ">
          <h3 className="font-semibold text-base mb-1">{item.title}</h3>
        </div>
      </Link>
    )
  );
}

function truncate(text) {
  const LENGTH = 80;
  if (text.length <= LENGTH) {
    return text;
  } else {
    return text.slice(0, LENGTH) + " ...";
  }
}
