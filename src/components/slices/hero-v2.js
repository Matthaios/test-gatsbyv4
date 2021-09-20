import React from "react";
import GatsbyBackgroundImage from "gatsby-background-image";
import cn from "classnames";
import get from "lodash/get";
import { FaChevronRight } from "react-icons/fa";

import Link from "../Link";
import { graphql } from "gatsby";
export default function HeroV2({ data }) {
  const text = get(data, "primary.text.html", "");
  const image = get(data, "primary.background_image.fluid");
  const cta = get(data, "primary.cta");
  return (
    <>
      {" "}
      <GatsbyBackgroundImage
        fluid={[image || "linear-gradient(transparent,transparent)"]}
      >
        <section className="mt-0 section-b-sm hero-section-overlay">
          <div className="container flex items-center pt-64 pb-48 phone:pt-56">
            <div className="w-full row">
              <div
                className={
                  "col w-full tablet:order-first  lg:w-1/2 md:w-3/4  flex-grow md:max-w-xl "
                }
              >
                <div
                  className="space-y-5 prose p-opacity-80"
                  dangerouslySetInnerHTML={{
                    __html: text,
                  }}
                ></div>
                {cta ? (
                  <div className="mt-10">
                    <Link
                      to="/marketplace/collections/9-11-day-x-epik"
                      className="button"
                    >
                      Go to collection
                    </Link>
                  </div>
                ) : (
                  <form
                    className="flex items-stretch mt-10 phone:flex-col phone:space-y-3"
                    action="https://epikgg.typeform.com/to/jU1YoNNF"
                    method="get"
                  >
                    <input
                      type="hidden"
                      id="typeform-welcome"
                      name="typeform-welcome"
                      value="0"
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email address"
                      required
                      className="flex-grow"
                    ></input>
                    <button type="submit">
                      Get Started <FaChevronRight className="ml-2" />{" "}
                    </button>
                  </form>
                )}
              </div>
              <div className="hidden col md:flex lg:w-1/2 md:w-1/4"></div>
            </div>
          </div>
        </section>
      </GatsbyBackgroundImage>
    </>
  );
}

export const query = graphql`
  fragment HeroV2 on PrismicPageDataBodyHeroV2 {
    primary {
      text {
        html
      }
      cta
      background_image {
        fluid(imgixParams: { q: 90 }) {
          ...GatsbyPrismicImageFluid
        }
        alt
      }
    }
  }
`;
