import React from "react";
import GatsbyBackgroundImage from "gatsby-background-image";
import cn from "classnames";
import get from "lodash/get";
import { Link as GatsbyLink } from "gatsby";
import Link from "../Link";
export default function HeroV1({ data, parentLink, blogTitle }) {
  const title = get(data, "primary.title.html", "");
  const image = get(data, "primary.background_image.fluid");
  return (
    <div className="collapse-next-section">
      {" "}
      <GatsbyBackgroundImage
        fluid={[image || "linear-gradient(transparent,transparent)"]}
      >
        <section className="mt-0 section-b-0 hero-section-overlay ">
          <div className="   container phone:!pb-16 tablet:py-40  py-56 ">
            <div
              className=" prose space-y-5 p-opacity-80   text-center"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            ></div>
          </div>
        </section>
      </GatsbyBackgroundImage>
    </div>
  );
}
