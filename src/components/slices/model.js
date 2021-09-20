import get from "lodash/get";
import React from "react";
import cn from "classnames";
import tw from "twin.macro";
import { css } from "@emotion/react";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp, IoMdClose } from "react-icons/io";

export default function Model({ data }) {
  return (
    <>
      <section>
        <div className="container">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: get(data, "primary.title1.html"),
            }}
          ></div>

          <div
            className="my-10 overflow-x-auto"
            css={css`
              .Feature + .Feature,
              .Title + .Title {
                ${tw`border-t border-white border-opacity-10`}
              }
            `}
          >
            {data.items &&
              data.items.map((row, index) => {
                const rowType = row.first_column_centered ? "Feature" : "Title";
                return (
                  <div
                    key={index}
                    className={cn(
                      `grid  grid-cols-[180px,repeat(6,110px)] items-center  xl:grid-cols-[200px,repeat(6,1fr)]  2xl:grid-cols-[220px,repeat(6,1fr)]  text-sm lg:text-base  text-center font-semibold ${rowType}`,
                      {
                        "bg-primary-dark font-semibold ": index === 0,
                        "bg-primary-dark bg-opacity-50 ": rowType === "Feature",
                      }
                    )}
                  >
                    {Object.keys(row).length > 1 &&
                      Object.keys(row)
                        .slice(1)
                        .map((col, i) => {
                          return (
                            <div
                              className={cn("py-4 px-8  leading-tight ", {
                                "text-left   text-white text-opacity-50":
                                  rowType === "Title" && col === "col1",
                                "pl-20":
                                  rowType === "Feature" && col === "col1",
                                "text-left": col === "col1",
                              })}
                              key={i}
                            >
                              {check(row[col], col === "col2")}
                            </div>
                          );
                        })}
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}

function check(i, variant) {
  if (i?.toLowerCase()?.trim() === "yes") {
    return <FaCheck className={cn("inline", { "text-primary": variant })} />;
  }
  if (i?.toLowerCase()?.trim() === "no") {
    return <Xicon />;
  }
  return i;
}

function Xicon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      className="inline"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2.91L13.09 0L8 5.09L2.91 0L0 2.91L5.09 8L0 13.09L2.91 16L8 10.91L13.09 16L16 13.09L10.91 8L16 2.91Z"
        fill="white"
      />
    </svg>
  );
}
