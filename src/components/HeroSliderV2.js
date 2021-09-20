import React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";
import AddToCartButton from "@components/AddToCartButton";
import { CardImage } from "@components/Card";
import { css } from "@emotion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import SwiperCore, { Pagination } from "swiper";
import { FormattedMessage } from "react-intl";
import { useEdition } from "../_api/useItems";
SwiperCore.use([Pagination]);
export default function HeroSliderV2() {
  const query = useStaticQuery(graphql`
    {
      allEdition(limit: 3) {
        nodes {
          edition_id
        }
      }
      prismicMarketplaceHero {
        data {
          edition {
            edition_id
            title
            text
            image {
              url
            }
          }
        }
      }
    }
  `);

  const items =
    query?.prismicMarketplaceHero?.data?.edition || query?.allEdition?.nodes;
  return items?.length == 0 ? (
    <div className="relative overflow-hidden  w-full h-56 md:h-[500px]    ">
      <img
        className="absolute inset-0 object-cover object-bottom w-full h-full "
        src="https://images.prismic.io/epikprime/c0041ac7-421f-48a7-b1c3-2bf57ecf9985_Screen+Shot+2021-04-28+at+7.53.19+PM.png?auto=compress%2Cformat&q=90&w=1600&h=504"
      />
      <div className="absolute inset-0 z-10 object-cover w-full h-full section-overlay"></div>
    </div>
  ) : (
    <div
      className="relative w-full h-[500px] xl:h-[800px] overflow-hidden"
      css={css`
        .swiper-pagination {
          position: absolute;
          top: 300px;
          right: calc((1024px - 10rem - 100vw) / -2);

          @media (max-width: 768px) {
            right: 50%;
            transform: translateX(50%);
            bottom: 0px;
            top: auto;
            display: flex;
            .swiper-pagination-bullet {
              width: 14px;
              height: 14px;
            }
            > * {
              margin: 0 0.75rem !important;
            }
          }
          @media (min-width: 1280px) {
            right: calc((1280px - 16rem - 100vw) / -2);
          }
          @media (min-width: 1420px) {
            right: calc((1420px - 10rem - 100vw) / -2);
          }
        }
        .swiper-pagination {
          @media (max-width: 767px) {
            display: none;
          }
        }
        .swiper-pagination-bullet {
          border-radius: 0;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.6);
        }
      `}
    >
      <Swiper
        className=""
        slidesPerView={1}
        spaceBetween={0}
        direction={"vertical"}
        pagination={{ clickable: true }}
      >
        {items?.map((item, index) => {
          return (
            <SwiperSlide key={index} className="">
              <Slide key={index} {...item} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

function Slide({ edition_id, title, text, image }) {
  const { item } = useEdition(edition_id);
  return (
    <div className="relative w-full h-[500px] xl:h-[800px]">
      {image?.url ? (
        <div
          className="!absolute object-cover h-full bg-no-repeat bg-center inset-0 z-0"
          style={{ backgroundImage: `url(${image?.url})` }}
        ></div>
      ) : (
        <CardImage
          data={item}
          className="!absolute inset-0 z-0"
          source="hero"
        />
      )}
      <div
        className="!absolute  inset-0 z-1 lg:opacity-50"
        css={css`
          @media (max-width: 1279px) {
            background-image: linear-gradient(
              #080112 0%,
              rgba(8, 1, 18, 0.5) 54%,
              #080112 100%
            );
          }
          background-image: linear-gradient(
            transparent 0%,
            rgba(8, 1, 18, 0.25) 15%,
            #080112 100%
          );
        `}
      ></div>
      <div className="relative z-2">
        <div className="container flex items-center h-[500px] xl:h-[800px] pb-20 tablet:pt-40 lg:pt-56">
          <div className="w-full row">
            <div
              className={
                "col w-full lg:w-1/2 md:w-3/4  flex-grow md:max-w-xl md:px-20"
              }
            >
              <div className="pt-20 space-y-5 prose lg:pt-0">
                <h1>{title || item?.edition_name}</h1>
                <p className="opacity-80">
                  {(text || item?.description)?.slice(0, 200)}
                  {(text || item?.description)?.length > 200 ? "..." : ""}
                </p>
                {/* <AddToCartButton item={item} /> */}
                <Link className="button" to={"/marketplace/set/i-love-nyc/"}>
                  Go to set
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
