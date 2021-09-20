import React, { useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import QuoteMarks from "../images/quote-marks.svg";
export default function TestimonialSlider({
  title,
  children,
  rows = 1,
  cols = 1,

  showOverflow,
}) {
  const options = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: cols,
    slidesToScroll: 1,
    rows,
    slidesPerRow: 1,
    adaptiveHeight: true,
    // variableHeight: true,
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
  const sliderRef = useRef();

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <img src={QuoteMarks} />
      </div>
      <div
        className={`-mx-4 slider-wrapper ${
          showOverflow ? "show-overflow" : ""
        }`}
      >
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
            className="w-8 h-8  text-white bg-primary flex-center cursor-pointer"
          >
            <MdKeyboardArrowRight />
          </span>
        </div>
      )}
    </>
  );
}
