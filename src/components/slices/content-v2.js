import React from "react";
import GatsbyBackgroundImage from "gatsby-background-image";
import cn from "classnames";
import get from "lodash/get";
import { css } from "@emotion/react";
import tw from "twin.macro";
import Link from "../Link";
import GatsbyImage from "gatsby-image";
export default function ContentV1({ data }) {
  const button_link = get(data, "primary.button_link");
  const button_text = get(data, "primary.button_text");
  const text_side = get(data, "primary.text_side");
  const text = get(data, "primary.text.html", "");
  const image = get(data, "primary.image.fluid");
  const imageAlt = get(data, "primary.image.alt");
  return (
    <>
      {" "}
      <section>
        <div className="   container ">
          <div className="row   items-center ">
            <div className="col w-full   lg:w-1/2   lg:!px-20 tablet:mb-10">
              {image && (
                <GatsbyImage
                  style={{
                    maxWidth: get(
                      data,
                      "primary.image.dimensions.width",
                      "100%"
                    ),
                  }}
                  className="mx-auto"
                  fluid={image}
                  alt={imageAlt}
                />
              )}
            </div>
            <div
              className={cn(
                "col !mt-0 w-full lg:w-1/2 lg:!px-20 py-20 tablet:order-last",
                {
                  "order-first": text_side === "Left",
                }
              )}
            >
              <div
                className=" prose  p-opacity-80   mb-10"
                css={css`
                  .block-img {
                    display: inline-block;
                    margin-top: 2rem;
                    margin-bottom: 0;
                    margin-right: 2rem;
                    @media (max-width: 767px) {
                      max-width: 30vw;
                      margin-right: 1rem;
                    }
                    + .block-img {
                      @media (max-width: 767px) {
                        margin-top: 1rem;
                      }
                    }
                  }
                `}
                dangerouslySetInnerHTML={{
                  __html: text,
                }}
              ></div>
              {button_text && (
                <Link to={button_link} className="button">
                  {button_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
