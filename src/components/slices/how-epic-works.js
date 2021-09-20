import get from "lodash/get";
import React from "react";
import { css } from "@emotion/react";
export default function HowEpicWorks({ data }) {
  const items = data.items;
  const title = get(data, "primary.title.html", "");

  return (
    <>
      <section className="how-epic-works">
        <div className="container py-20 phone:py-6 ">
          <div className="grid grid-cols-4 gap-4 prose table:justify-center prose-no-h-margins max-w-none">
            <div
              className="col-span-4 pr-8 tablet:mb-8 lg:col-span-1"
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
            <div className="grid col-span-4 gap-4 lg:col-span-3 sm:grid-cols-2 md:grid-cols-3">
              {items &&
                items.length > 0 &&
                items.map(({ point_title, point_text }, index) => {
                  return (
                    <div key={index} className="items ">
                      <div>
                        <div className="w-12 h-12 text-2xl font-bold border-2 text-primary border-primary flex-center ">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h4>{point_title}</h4>
                        <p className="opacity-75">{point_text}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
