import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";
import Slider from "../LogoSlider";
import cn from "classnames";
export default function NewBrands({ data }) {
  const logos = get(data, "items");
  const title = get(data, "primary.title.html", "");
  const text = get(data, "primary.text.html", "");
  const background = get(data, "primary.background");

  return (
    <>
      <section
        className={cn(" py-20", {
          "bg-primary-dark": background === "Primary Dark",
          "bg-primary": background === "Primary",
        })}
      >
        <div className="container">
          <div className="row items-center">
            <div
              className="col w-full tablet:mb-8 lg:w-1/3 prose p-opacity-80 prose-no-h-margins space-y-4"
              dangerouslySetInnerHTML={{ __html: title + text }}
            ></div>
            <div className="col w-full lg:w-2/3">
              <div>
                {" "}
                <Slider>
                  {logos &&
                    logos.length > 0 &&
                    Array.from({ length: Math.ceil(logos.length / 4) }).map(
                      (_, index) => {
                        return (
                          <div
                            className="ml-auto  new-brands-grid "
                            key={index}
                          >
                            {logos
                              .slice(index * 4, index * 4 + 4)
                              .map(({ logo }, i, lArray) => {
                                return (
                                  <React.Fragment key={`${index}-${i}`}>
                                    {" "}
                                    <div
                                      className="grid items-center min-h-[120px]"
                                      style={{ width: "100%", maxWidth: 150 }}
                                    >
                                      {get(logo, "fluid") && (
                                        <GatsbyImage
                                          fluid={logo.fluid}
                                        ></GatsbyImage>
                                      )}
                                    </div>
                                  </React.Fragment>
                                );
                              })}
                            {Array.from({
                              length:
                                4 -
                                logos.slice(index * 4, index * 4 + 4).length,
                            }).map((_, i) => {
                              return <div key={i}> </div>;
                            })}
                          </div>
                        );
                      }
                    )}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
