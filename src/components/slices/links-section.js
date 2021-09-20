import get from "lodash/get";
import React from "react";

export default function LinksSection({ data }) {
  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div
              className="col w-full md:w-auto   lg:w-1/4 prose prose-no-h-margins"
              dangerouslySetInnerHTML={{
                __html: get(data, "primary.title.html", ""),
              }}
            ></div>
            <div className="col w-full md:w-1/2   lg:w-3/4 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.items &&
                data.items.map((col, index) => {
                  return (
                    <div
                      className="links-columns"
                      dangerouslySetInnerHTML={{
                        __html: get(col, "text_columns.html", ""),
                      }}
                      key={index}
                    ></div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
