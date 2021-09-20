import React from "react";
import GatsbyBackgroundImage from "gatsby-background-image";
import cn from "classnames";
import get from "lodash/get";

import Link from "../Link";
export default function ContentV1({ data }) {
  const button_link = get(data, "primary.button_link");
  const text_side = get(data, "primary.text_side");
  const button_text = get(data, "primary.button_text");
  const text = get(data, "primary.text.html", "");
  const image = get(data, "primary.image.fluid");
  return (
    <>
      {" "}
      <GatsbyBackgroundImage
        fluid={[image || "linear-gradient(transparent,transparent)"]}
      >
        <section className="section-overlay">
          <div className="  min-h-1000 container flex items-center py-40 ">
            <div className="row w-full">
              <div className="col  hidden md:flex  lg:w-1/2 md:w-1/4"></div>
              <div
                className={cn(
                  "col w-full tablet:order-first  lg:w-1/2 md:w-3/4  flex-grow md:max-w-xl md:!px-20",
                  {
                    "order-first": text_side === "Left",
                  }
                )}
              >
                <div
                  className=" prose space-y-5 p-opacity-80"
                  dangerouslySetInnerHTML={{
                    __html: text,
                  }}
                ></div>
                {button_text && (
                  <Link to={button_link} className="button mt-10">
                    {button_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </GatsbyBackgroundImage>
    </>
  );
}
