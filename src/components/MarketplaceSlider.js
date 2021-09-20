import React, { useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "../components/Link";
import GatsbyBackgroundImage from "gatsby-background-image";
import get from "lodash/get";
import cn from "classnames";
export default function MarketplaceSlider({ games }) {
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
        {games &&
          games.length > 0 &&
          games.map(({ game: { document: game } }) => {
            return <Game data={game} />;
          })}
      </SlickSlider>
      <div className="slider-nav">
        <div className="container">
          {" "}
          {games &&
            games.length > 0 &&
            games.map((g, index) => {
              return (
                <div
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

function Game({ data }) {
  return (
    <div>
      {" "}
      <GatsbyBackgroundImage
        fluid={[
          get(data, "data.background_image.fluid"),
          "linear-gradient(transparent,transparent)",
        ].filter(Boolean)}
      >
        <section className="section-overlay">
          <div className="container flex items-center py-24  lg:py-48">
            <div className="w-full row">
              <div
                className={
                  "col w-full    lg:w-1/2 md:w-3/4  flex-grow md:max-w-xl md:!px-20"
                }
              >
                <div
                  className="space-y-5 prose  p-opacity-80"
                  dangerouslySetInnerHTML={{
                    __html:
                      get(data, "data.title.html", "") +
                      get(data, "data.excerpt.html", ""),
                  }}
                ></div>
                <Link to={`/game/${data.uid}/`} className="mt-10 button">
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
