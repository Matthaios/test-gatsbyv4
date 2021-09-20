import { Link } from "gatsby";
import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";
import { css } from "@emotion/react";
import Slider from "./EventDetailsSlider";

export default function EventDetails({ event }) {
  const data = get(event, "document.data");
  const logos = get(data, "logo_group");
  return (
    <>
      <div className="bg-primary-dark px-10 py-16  ">
        <div className="row">
          <div className="col w-full md:w-2/5 ">
            <div>
              {get(data, "video.html") ? (
                <div
                  css={css`
                    iframe {
                      max-width: 100%;
                    }
                  `}
                  dangerouslySetInnerHTML={{
                    __html: get(data, "video.html"),
                  }}
                ></div>
              ) : (
                <div
                  css={css`
                    position: relative;
                    width: 100%;
                    padding-bottom: 100%;
                    .gatsby-image-wrapper,
                    > div {
                      position: absolute !important;
                      top: 0;
                      left: 0;
                      padding-bottom: 0 !important;
                      height: 100%;
                      width: 100%;
                    }
                  `}
                >
                  {get(data, `background.fluid`) && (
                    <GatsbyImage fluid={get(data, `background.fluid`)} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col w-full md:w-3/5 prose prose-no-h-margins p-opacity-80 space-y-8">
            <h3>{get(event, `document.data.name.text`)}</h3>
            {logos && (
              <div className="flex flex-wrap justify-start   items-cent">
                {logos.map(({ logo, logo_link }, index) => {
                  return (
                    <Link
                      to={`/${logo_link.type.replace("_", "-")}/${
                        logo_link.uid
                      }`}
                      key={index}
                      className="block w-full   mr-8 my-4"
                      style={{ maxWidth: get(logo, "dimensions.width") }}
                    >
                      {logo.fluid && (
                        <GatsbyImage
                          imgStyle={{
                            objectFit: "contain",
                            margin: 0,
                          }}
                          fluid={logo.fluid}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
            <div className="flex items-center space-x-4">
              {" "}
              <div className="grid gap-x-4 gap-y-2 grid-cols-2">
                <div className="contents">
                  <strong>Where:</strong>{" "}
                  <div>
                    <Link
                      to={`/game/${get(data, "game.uid")}`}
                      className="hover:font-semibold hover:underline"
                    >
                      {get(data, "game.document.data.title.text")}
                    </Link>
                    {get(data, "game_publisher.document.uid") && (
                      <>
                        ,{" "}
                        <Link
                          to={`/publisher/${get(
                            data,
                            "game_publisher.document.uid"
                          )}`}
                          className="hover:font-semibold hover:underline"
                        >
                          {get(data, "game_publisher.document.data.name.text")}
                        </Link>{" "}
                      </>
                    )}
                  </div>
                </div>
                <div className="contents">
                  <strong>When:</strong> <div>{get(data, "release_date")}</div>
                </div>
                <div className="contents">
                  <strong>Until:</strong> <div>{get(data, "end_date")}</div>
                </div>
                <div className="contents">
                  <strong>Featuring:</strong>{" "}
                  <div>
                    {" "}
                    <Link
                      className="hover:font-semibold hover:underline"
                      to={`/brand/${get(data, "brand.uid")}`}
                    >
                      {get(data, "brand.document.data.name.text")}
                    </Link>
                    {get(data, "brand_owner.document.uid") && (
                      <>
                        ,{" "}
                        <Link
                          to={`/brand-owner/${get(
                            data,
                            "brand_owner.document.uid"
                          )}`}
                          className="hover:font-semibold hover:underline"
                        >
                          {get(data, "brand_owner.document.data.name.text")}
                        </Link>{" "}
                      </>
                    )}
                  </div>
                </div>
                {get(data, "item_list[0]") && (
                  <div>
                    <strong>Items:</strong>
                  </div>
                )}
              </div>
            </div>

            <div>
              {get(data, "item_list[0]") && (
                <Slider>
                  {get(data, "item_list").map(({ item }, i) => {
                    return (
                      <div key={i}>
                        {get(item, "document.data.background_image.fixed") && (
                          <GatsbyImage
                            imgStyle={{ margin: 0 }}
                            fixed={get(
                              item,
                              "document.data.background_image.fixed"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </Slider>
              )}
            </div>
            <div>
              {" "}
              <Link
                to={`/event/${event && event.uid}`}
                type="submit"
                className="btn bg-primary py-3  px-5 mt-4 sm:mt-0 "
                style={{ minWidth: "auto" }}
              >
                Go to event page
              </Link>
              <a className="inline-block font-semibold underline ml-6">
                {" "}
                Download {get(data, "game.document.data.title.text")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
