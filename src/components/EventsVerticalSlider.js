import React, { useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "./Link";
import GatsbyBackgroundImage from "gatsby-background-image";
import get from "lodash/get";
import cn from "classnames";
export default function EventsVerticalSlider({ events }) {
  const [slide, setSlide] = useState(0);
  const options = {
    dots: true,
    infinite: false,
    autoplay: true,
    speed: 500,

    autoplaySpeed: 5000,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          adaptiveHeight: true,
        },
      },
    ],

    beforeChange: (current, next) => setSlide(next),
  };
  const sliderRef = useRef();

  return (
    <div className="relative overflow-hidden">
      <SlickSlider ref={sliderRef} {...options}>
        {events &&
          events.length > 0 &&
          events.map(({ event: { document: event } }, index) => {
            return <Event data={event} key={index} />;
          })}
      </SlickSlider>
      <div className="slider-nav">
        <div className="container">
          {" "}
          {events &&
            events.length > 0 &&
            events.map((g, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    sliderRef.current.slickGoTo(index);
                  }}
                  className={cn("slider-dot", {
                    active: index === slide,
                  })}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function Event({ data }) {
  return (
    <div>
      {" "}
      <GatsbyBackgroundImage
        fluid={[
          get(data, "data.featured_image.fluid"),
          "linear-gradient(transparent,transparent)",
        ].filter(Boolean)}
      >
        <section className="section-overlay">
          <div className=" container flex items-center py-24 lg:py-48">
            <div className="row w-full">
              <div
                className={
                  "col w-full lg:w-1/2 md:w-3/4  flex-grow md:max-w-xl md:!px-20"
                }
              >
                <div
                  className=" prose space-y-5 p-opacity-80"
                  dangerouslySetInnerHTML={{
                    __html:
                      get(data, "data.title.html", "") +
                      get(data, "data.excerpt.html", ""),
                  }}
                ></div>
                <Link to={`/event/${data.uid}/`} className="button mt-10">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </GatsbyBackgroundImage>
    </div>
  );
}
