import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";
import { GoPlus } from "react-icons/go";

export default function Business({ data }) {
  const items = get(data, "items");
  const title = get(data, "primary.title.html");
  const right_column_image = get(data, "primary.right_column_image.fluid");
  const left_column_image = get(data, "primary.left_column_image.fluid");
  return (
    <>
      <section>
        <div className="container">
          {" "}
          <div
            className="prose text-center"
            dangerouslySetInnerHTML={{ __html: title }}
          ></div>
          <div className="business-benefits-grid">
            <div>
              <div>
                {left_column_image && <GatsbyImage fluid={left_column_image} />}
              </div>
              {items && items.length > 0 && (
                <div className="mt-8   p-opacity-80  ">
                  <h2 className="mb-8">{data.primary.left_column_title}</h2>
                  <div className="pl-6">
                    {" "}
                    {items
                      .filter((i) => i.column === "Left")
                      .map((item) => {
                        return (
                          <div className="benefits-item-grid mb-8">
                            <div>
                              <img src={get(item, "image.url")} />
                            </div>
                            <div
                              className="space-y-1"
                              dangerouslySetInnerHTML={{
                                __html: item.column_text.html,
                              }}
                            ></div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center text-center lg:mt-4  xl:mt-10">
              <div className="font-bold text-lg xl:text-2xl text-center">
                Brands
              </div>
              <div className="my-8 text-2xl flex-center w-16 h-16 leading-none rounded-full bg-primary shadow-glow">
                <GoPlus />
              </div>
              <div className="font-bold text-lg xl:text-2xl text-center">
                Digital Platforms
              </div>
            </div>
            <div>
              <div>
                {right_column_image && (
                  <GatsbyImage fluid={right_column_image} />
                )}
              </div>
              {items && items.length > 0 && (
                <div className="mt-8   p-opacity-80  ">
                  <h2 className="mb-8">{data.primary.right_column_title}</h2>
                  <div className="pl-6">
                    {" "}
                    {items
                      .filter((i) => i.column === "Right")
                      .map((item) => {
                        return (
                          <div className="benefits-item-grid mb-8">
                            <div>
                              <img src={get(item, "image.url")} />
                            </div>
                            <div
                              className="space-y-1"
                              dangerouslySetInnerHTML={{
                                __html: item.column_text.html,
                              }}
                            ></div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
