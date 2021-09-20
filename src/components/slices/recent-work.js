import React, { useState } from "react";
import Slider from "../Slider";
import { FaRegCalendarAlt } from "react-icons/fa";
import get from "lodash/get";
import GatsbyImage from "gatsby-image";
import { Link } from "gatsby";
import Collapse from "@components/Collapse";
import EventDetails from "../EventDetails";
export default function RecentWork({ data }) {
  const items = data && data.items;
  const [selected, setSelected] = useState(null);

  // const selectedEvent = get(items, `[${selected}].event`)
  return (
    <>
      <section className="overflow-hidden">
        <div className="container">
          <Slider
            rows={2}
            cols={3}
            title={get(data, "primary.title.text") || "Recent work"}
            showOverflow
          >
            {items &&
              items.length > 0 &&
              items.map((item, i) => {
                const document = get(item, "item.document.data");
                return document ? (
                  <Link
                    to={`/event/${get(item, "item.uid")}`}
                    onClick={() => {
                      if (selected === i) {
                        setSelected(null);
                      } else {
                        setSelected(i);
                      }
                    }}
                    key={i}
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
            <EventDetails event={selectedEvent} />
          </Collapse> */}
        </div>
      </section>
    </>
  );
}
