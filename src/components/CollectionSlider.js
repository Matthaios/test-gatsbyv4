import React, { useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { css } from "@emotion/react";
import { Link } from "gatsby";
import cn from "classnames";
import { FormattedMessage } from "react-intl";
import Card, { truncate } from "./Card";
import get from "lodash/get";
import hideAuctionItems from "@utils/hideAuctionItems";

export default function CollectionSlider({ collection, expanded }) {
  console.log(collection);
  const items = collection?.sets
    ?.map((set) => {
      return set?.editions;
    })
    ?.flat()
    ?.filter(hideAuctionItems);

  const childrenNo = items?.length;
  const [edges, setEdges] = useState([true, false]);
  const options = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 4,

    afterChange: function (before) {
      const slider = sliderRef.current;
      const slidesToScroll = slider?.innerSlider?.props?.slidesToScroll;
      setEdges([
        slider.innerSlider.state?.currentSlide === 0,
        before + slidesToScroll >= childrenNo,
      ]);
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },

      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const sliderRef = useRef();

  return expanded ? (
    <div className="overflow-hidden bg-primary-dark bg-pattern">
      <div className="container my-10 ">
        <div className={` relative w-full`}>
          <div className="py-10 ">
            <div className="px-4 phone:flex md:items-center phone:flex-col">
              <div className="prose prose-no-h-margins">
                <h1 className="!text-yellow">{collection?.name} </h1>
              </div>
              <Link
                to={collection?.slug}
                className="w-auto   bg-yellow/20  !text-yellow hover:text-opacity-80  phone:mt-2 mt-4 inline-block px-4 py-1  font-semibold"
              >
                <FormattedMessage id="see_collection" />
              </Link>
            </div>
            {collection.sets.map((set) => {
              return <SetLine key={set.slug} set={set} />;
            })}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      className="overflow-hidden"
      css={css`
        .slick-arrow {
          pointer-events: none;
          opacity: 0;
        }
      `}
    >
      <div className="container my-10 ">
        <div className="flex justify-between mb-10 md:items-center phone:flex-col">
          <div className="prose prose-no-h-margins">
            <h2>{collection?.name} </h2>
          </div>
          <Link to={collection?.slug} className="w-auto button phone:mt-2">
            <FormattedMessage id="see_collection" />
          </Link>
        </div>
        <div
          className={cn(`-mx-4 slider-wrapper show-overflow relative w-full`)}
        >
          {items?.length > 0 && (
            <>
              {!edges[0] && (
                <span
                  onClick={() => {
                    if (sliderRef && sliderRef.current) {
                      sliderRef.current.slickPrev();
                    }
                  }}
                  className=" w-8 h-8 lg:w-[52px] lg:h-[52px]  transform lg:translate-x-[-26px] bg-white text-primary   flex-center cursor-pointer absolute z-10 left-4 top-20 xl:top-24 phone:!hidden"
                >
                  <MdKeyboardArrowLeft className="h-6 lg:w-6" />
                </span>
              )}
              {!edges[1] && (
                <span
                  onClick={() => {
                    if (sliderRef && sliderRef.current) {
                      sliderRef.current.slickNext();
                    }
                  }}
                  className=" w-8 h-8 lg:w-[52px] lg:h-[52px] transform lg:translate-x-[26px]  text-white  bg-primary flex-center cursor-pointer absolute z-10 right-4 top-20 xl:top-24 phone:!hidden"
                >
                  <MdKeyboardArrowRight className="h-6 lg:w-6" />
                </span>
              )}
            </>
          )}
          <SlickSlider ref={sliderRef} {...options}>
            {items?.map((item) => {
              return (
                <div className="px-4 mb-6" key={item.edition_id}>
                  <Card data={item} />
                </div>
              );
            })}
          </SlickSlider>
        </div>
      </div>
    </div>
  );
}

function SetLine({ set }) {
  const items = set?.editions.filter(hideAuctionItems);

  const childrenNo = items?.length;
  const [edges, setEdges] = useState([true, false]);
  const options = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 4,

    afterChange: function (before) {
      const slider = sliderRef.current;
      const slidesToScroll = slider?.innerSlider?.props?.slidesToScroll;
      setEdges([
        slider.innerSlider.state?.currentSlide === 0,
        before + slidesToScroll >= childrenNo,
      ]);
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },

      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const sliderRef = useRef();
  return (
    <div
      css={css`
        .slick-arrow {
          pointer-events: none;
          opacity: 0;
        }
      `}
    >
      <div className="my-6 ">
        <div className="flex justify-between px-4 mb-10 md:items-center phone:flex-col">
          <div className="prose prose-no-h-margins">
            <h3>{set?.name} </h3>
          </div>
          <Link to={set?.slug} className="w-auto button phone:mt-2">
            Set details
          </Link>
        </div>
        <div className={` slider-wrapper show-overflow relative w-full`}>
          {items?.length > 0 && (
            <>
              {!edges[0] && (
                <span
                  onClick={() => {
                    if (sliderRef && sliderRef.current) {
                      sliderRef.current.slickPrev();
                    }
                  }}
                  className=" w-8 h-8 lg:w-[52px] lg:h-[52px]  transform lg:translate-x-[-26px] bg-white text-primary   flex-center cursor-pointer absolute z-10 left-4 top-20 xl:top-24 phone:!hidden"
                >
                  <MdKeyboardArrowLeft className="h-6 lg:w-6" />
                </span>
              )}
              {!edges[1] && (
                <span
                  onClick={() => {
                    if (sliderRef && sliderRef.current) {
                      sliderRef.current.slickNext();
                    }
                  }}
                  className=" w-8 h-8 lg:w-[52px] lg:h-[52px] transform lg:translate-x-[26px]  text-white  bg-primary flex-center cursor-pointer absolute z-10 right-4 top-20 xl:top-24 phone:!hidden"
                >
                  <MdKeyboardArrowRight className="h-6 lg:w-6" />
                </span>
              )}
            </>
          )}
          <SlickSlider ref={sliderRef} {...options}>
            {items?.map((item) => {
              return (
                <div className="px-4 mb-6" key={item.edition_id}>
                  <Card data={item} />
                </div>
              );
            })}
          </SlickSlider>
        </div>
      </div>
    </div>
  );
}
