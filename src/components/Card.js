import React, { useEffect, useState, useMemo } from "react";
import { css } from "@emotion/react";
import cn from "classnames";
// import GatsbyImage from "gatsby-background-image";
import { FaHeart, FaLock, FaRegHeart } from "react-icons/fa";
import get from "lodash/get";
import useCart from "@api/useCart";
import { Link, navigate } from "gatsby";
import AddToCartButton from "./AddToCartButton";
import ReactPlayer from "react-player/lazy";
import formatPrice from "@utils/formatPrice";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { BsLock } from "react-icons/bs";
import Modal from "./Modal";
import useAuth from "@api/useAuth";
import { FormattedMessage } from "react-intl";
import useIsLocked from "@api/useIsLocked";

export default function LockedCard({ data, isExtended }) {
  const [isOpen, setIsOpen] = useState(false);

  function openLockedModal() {
    setIsOpen(true);
  }

  const isLocked = useIsLocked(data);
  const Tag = isLocked ? "div" : Link;
  return (
    data && (
      <div data-testid="edition-card">
        {" "}
        <Tag
          data-testid="edition-card-link"
          to={data.slug}
          className={cn("cursor-pointer ", {
            "filter grayscale": isLocked,
          })}
          onClick={isLocked ? openLockedModal : () => {}}
        >
          <div
            className={cn("relative block overflow-hidden h-52 xl:h-64", {
              "filter grayscale": isLocked,
            })}
          >
            {isLocked && (
              <div className="w-full h-full bg-primary-dark bg-opacity-20 flex items-center justify-center relative z-[2]">
                <FaLock className="text-3xl " />
              </div>
            )}
            <CardImage
              data={data}
              className="!absolute inset-0 w-full h-full"
            />
            {!isLocked && parseFloat(data.token_price) && (
              <span className="absolute font-semibold filter drop-shadow bottom-2 right-4">
                {formatPrice(data.token_price)}
              </span>
            )}
          </div>
        </Tag>
        <div className="mt-4 ">
          <h3 className="mb-1 text-base font-semibold">{data.edition_name}</h3>
          {isExtended && (
            <>
              {" "}
              <p className="overflow-hidden text-sm opacity-75">
                {truncate(get(data, "edition_description", ""))}
              </p>
              <div className="flex flex-col items-start xl:flex-wrap xl:items-center xl:flex-row">
                <div className="mt-3">
                  <AddToCartButton item={data} hidePrice />
                </div>
                <Link to={data.slug} className="mt-3 text-sm cursor-pointer">
                  <FormattedMessage id="learn_more" />
                </Link>
              </div>
            </>
          )}
        </div>
        <Modal {...{ isOpen, setIsOpen }}>
          <div
            className="prose "
            css={css`
              img {
                margin-top: 0 !important;
                margin-bottom: 0 !important;
              }
            `}
          >
            {" "}
            <h2>Content locked</h2>
            <p>{data?.locked_message}</p>
            {data?.show_store_buttons && (
              <p className="flex flex-wrap md:items-center phone:flex-col phone:space-y-3 md:space-x-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftA9HM"
                  target="_blank"
                >
                  {" "}
                  <StaticImage
                    layout="fixed"
                    height={42}
                    width={140}
                    src="../images/google-play.png"
                  />
                </a>
                <a
                  href="https://apps.apple.com/ph/app/asphalt-9-legends/id805603214"
                  target="_blank"
                >
                  <StaticImage
                    layout="fixed"
                    height={41}
                    width={140}
                    src="../images/apple-store.png"
                  />
                </a>
              </p>
            )}
            <p className="space-x-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <FormattedMessage id="thank_you" />
              </button>
              <Link to={data.slug} className="mt-3 text-sm cursor-pointer">
                <FormattedMessage id="learn_more" />
              </Link>
            </p>
          </div>
        </Modal>
      </div>
    )
  );
}

export function CardImage({ data, source = "media", ...rest }) {
  const firstImage = data?.[source]?.find?.((i) => i.type === "image");
  const firstGif = data?.[source]?.find?.((i) => i.type === "gif");
  const firstVideo = data?.[source]?.find?.((i) => i.type === "video");

  if (firstImage) {
    return (
      <GatsbyImage
        className="w-full h-full"
        {...rest}
        alt=""
        imgStyle={{ width: "100%", height: "100%" }}
        objectFit="cover"
        image={get(firstImage, "file.sharp.gatsbyImageData")}
      />
    );
  } else if (firstGif) {
    return (
      <img
        className="object-cover w-full h-full"
        {...rest}
        alt=""
        src={get(firstGif, "file.url")}
      />
    );
  } else if (firstVideo) {
    return (
      <div
        className="relative w-full h-full"
        {...rest}
        css={css`
          > div {
            width: 100% !important;
            height: 100% !important;
            video {
              object-fit: cover;
            }
          }
        `}
      >
        <ReactPlayer
          loop
          playing={true}
          muted={true}
          style={{ width: "100%", height: "100%" }}
          url={firstVideo.url}
        />
      </div>
    );
  } else {
    return <div className="!h-52 lg:!h-64 overflow-hidden" />;
  }
}

export function truncate(text) {
  const LENGTH = 80;
  if (text.length <= LENGTH) {
    return text;
  } else {
    return text.slice(0, LENGTH) + " ...";
  }
}
