import React, { useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { css } from "@emotion/react";

import SwiperCore, { Navigation, EffectFade } from "swiper/core";
SwiperCore.use([Navigation]);
export default function Slider({ title, children, rows = 1, cols = 1 }) {
  const nextRef = useRef();
  const prevRef = useRef();

  const options = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: cols,
    slidesToScroll: 1,
    rows,
    slidesPerRow: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          rows,
          slidesToShow: cols === 1 ? 1 : 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          rows,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container my-10">
      <div className="flex items-center justify-between mb-10">
        <div className="prose prose-no-h-margins">
          <h2>{title} </h2>
        </div>
        {React.Children.count(children) > 0 && (
          <div className="flex space-x-3">
            <span
              ref={prevRef}
              className="w-8 h-8 bg-white text-primary   flex-center cursor-pointer"
            >
              <MdKeyboardArrowLeft />
            </span>
            <span
              ref={nextRef}
              className="w-8 h-8  text-white  bg-primary flex-center cursor-pointer"
            >
              <MdKeyboardArrowRight />
            </span>
          </div>
        )}
      </div>
      <div
        css={css`
          .swiper-container {
            overflow: visible !important;
          }
          .swiper-slide {
            transition: opacity 300ms;
          }
          .swiper-slide:not(.swiper-slide-visible) {
            opacity: 0.2;
          }
        `}
      >
        <SwiperComponent
          slideActiveClass="active"
          spaceBetween={32}
          watchSlidesVisibility={true}
          slidesPerView={2}
          slidesPerGroup={1}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          breakpoints={{
            640: {
              slidesPerGroup: 1.5,
              slidesPerView: 3,
            },
            //   1024: {
            //     slidesPerGroup: 4,
            //     slidesPerView: 4,
            //   },
          }}
        >
          {React.Children.toArray(children).map((child) => {
            return (
              <SwiperSlide key={child.key}>
                <div>{child}</div>
              </SwiperSlide>
            );
          })}
        </SwiperComponent>
      </div>
    </div>
  );
}
