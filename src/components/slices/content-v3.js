import React from "react";
import GatsbyBackgroundImage from "gatsby-background-image";
import cn from "classnames";
import get from "lodash/get";

import Link from "../Link";
export default function ContentV3({ data }) {
  const button_link = get(data, "primary.button_link");
  const button_label = get(data, "primary.button_label");
  const text_aligned = get(data, "primary.text_aligned");
  const text = get(data, "primary.text.html", "");
  const image = get(data, "primary.image.fluid");
  return (
    <>
      {" "}
      <GatsbyBackgroundImage
        fluid={[image || "linear-gradient(transparent,transparent)"]}
      >
        <section>
          <div className="    container flex items-center ">
            <div
              className={cn("max-w-2xl w-full prose  p-opacity-80", {
                "text-center mx-auto ": !text_aligned,
                "mt-20": text_aligned,
              })}
            >
              <div
                className=" prose space-y-5"
                dangerouslySetInnerHTML={{
                  __html: text,
                }}
              ></div>
              {button_label && (
                <Link to={button_link} className="button mt-10">
                  {button_label}
                </Link>
              )}
            </div>
          </div>
        </section>
      </GatsbyBackgroundImage>
    </>
  );
}
