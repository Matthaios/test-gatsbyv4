import React, { useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cn from "classnames";
import get from "lodash/get";
export default function MarketplaceHSlider({
  title,
  children,
  rows = 1,
  showDots,
}) {
  const options = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    rows,
    slidesPerRow: 1,

    customPaging: (i) => {
      const slide =
        get(sliderRef.current, "innerSlider.state.currentSlide") || 0;
      return (
        <div
          className={"  rounded-full  -mt-2"}
          style={{
            background: i === slide ? "#512C84" : "#463C55",
            width: 6,
            height: 6,
            boxShadow: i === slide ? "0px 0px 0 5px rgba(81, 44, 132, .3)" : "",
          }}
        >
          {" "}
        </div>
      );
    },
    responsive: [
      {
        breakpoint: 1240,
        settings: {
          rows,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          rows,
          slidesToShow: 2,
        },
      },
    ],
  };
  const sliderRef = useRef();

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div className="prose prose-no-h-margins">
          <h4>{title}</h4>
        </div>
        {React.Children.count(children) > 0 && (
          <div className="flex space-x-3">
            <span
              onClick={() => {
                if (sliderRef && sliderRef.current) {
                  sliderRef.current.slickPrev();
                }
              }}
              className="w-8 h-8 bg-white text-primary   flex-center cursor-pointer"
            >
              <MdKeyboardArrowLeft />
            </span>
            <span
              onClick={() => {
                if (sliderRef && sliderRef.current) {
                  sliderRef.current.slickNext();
                }
              }}
              className="w-8 h-8  text-white  bg-primary flex-center cursor-pointer"
            >
              <MdKeyboardArrowRight />
            </span>
          </div>
        )}
      </div>
      <div className={`-mx-4   slider-wrapper  ${showDots ? "" : "hide-dots"}`}>
        <SlickSlider ref={sliderRef} {...options}>
          {React.Children.toArray(children).map((child) => {
            return (
              <div className="px-4 mb-6" key={child.key}>
                {child}
              </div>
            );
          })}
        </SlickSlider>
      </div>
    </>
  );
}
