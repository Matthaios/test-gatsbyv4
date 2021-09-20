import React, { useState } from "react";
import Slider from "../Slider";
import { FaCommentDots, FaRegCalendarAlt } from "react-icons/fa";
import get from "lodash/get";
import GatsbyImage from "gatsby-image";
import { Link } from "gatsby";
import Collapse from "@components/Collapse";
import EventDetails from "../EventDetails";
export default function UpcomingEvents({ data }) {
  const items = data.items;
  return (
    <>
      <section className="overflow-hidden">
        <div className="container">
          <Slider
            rows={1}
            cols={4}
            title={get(data, "primary.title.text") || "Upcoming Events"}
            showOverflow
          >
            {/*items &&
              items.length > 0 &&
              items
                //   items
                .map((item, i) => {
                  const document = get(item, "item.document.data")

                  const title = get(document, "title.text")
                  const excerpt = get(document, "excerpt.text")
                  return document ? (
                    <Link
                      to={`/event/${get(item, "item.document.uid")}`}
                      key={i}
                      className="hover:border-b-2 border-primary pb-4"
                    >
                      <div className="relative h-40 overflow-hidden ">
                        {get(document, "thumbnail.fluid") && (
                          <GatsbyImage fluid={document.thumbnail.fluid} />
                        )}
                        {/*<div className="absolute top-0 right-0 mt-4 mr-4 flex-center leading-none p-2  text-xs bg-primary   rounded-full">
                          7.5
                        </div>*/}
            {/*</div>
                      <div className="mt-2   p-opacity-80">
                        <h5 className="font-semibold">{title}</h5>
                        <p>
                          {excerpt && excerpt.split(" ").slice(0, 12).join(" ")}{" "}
                          {excerpt && excerpt.split(" ").length > 12 && "..."}
                        </p>
                        {/*<div className="text-xs flex items-center">
                          <FaCommentDots className="mr-2" />{" "}
                          <span>6 comments</span>
                        </div>*/}
            {/*</div>
                    </Link>
                  ) : null
                })*/}
            {items &&
              items.length > 0 &&
              items.map((item, i) => {
                const document = get(item, "item.document.data");
                return document ? (
                  <Link
                    to={`/event/${get(item, "item.document.uid")}`}
                    key={i}
                    className="hover:border-b-2 border-primary pb-4"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {get(document, "thumbnail.fluid") && (
                        <GatsbyImage fluid={document.thumbnail.fluid} />
                      )}
                      {document.date && (
                        <div className="absolute bottom-0 left-0 flex items-center px-2 space-x-1 text-xs bg-primary py-2">
                          <FaRegCalendarAlt />{" "}
                          <div className="leading-none">{document.date}</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="font-bold">{get(document, "name.text")}</p>
                    </div>
                  </Link>
                ) : null;
              })}
          </Slider>

          {/* <Collapse isOpen={selected !==null}>
            <EventDetails event={get(data, `items[${selected}].item`)} />
          </Collapse> */}
        </div>
      </section>
    </>
  );
}
