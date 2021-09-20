import get from "lodash/get";
import React, { useState } from "react";
import {
  BsCaretDown,
  BsCaretDownFill,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import Collapse from "@components/Collapse";

export default function Faq({ data }) {
  const [isOpen, setIsOpen] = useState(null);
  const splitAt = data.items && Math.ceil(data.items.length / 2);
  return (
    <>
      <section className="bg-primary-dark pt-12 pb-16 lg:pt-20 lg:pb-24 font-mono">
        <div className="container">
          <div
            className="text-center prose prose-no-h-margins"
            dangerouslySetInnerHTML={{
              __html: get(data, "primary.title.html"),
            }}
          ></div>
          <div className="faq mt-10">
            {" "}
            <div>
              {data.items &&
                data.items.slice(0, splitAt).map((qa, index) => {
                  return (
                    <div
                      key={index}
                      className="border-b border-white border-opacity-25"
                      onClick={() => {
                        isOpen !== index ? setIsOpen(index) : setIsOpen(null);
                      }}
                    >
                      <div className="grid grid-cols-[1rem,1fr,1rem] gap-3 py-5   cursor-pointer ">
                        <BsFillQuestionCircleFill className="mt-0.5" />
                        <h6 className="leading-tight ">
                          {get(qa, "question", "")}
                        </h6>
                        <BsCaretDownFill className="mt-0.5" />
                      </div>
                      <div className="grid grid-cols-[1rem,1fr,1rem] gap-3    opacity-80">
                        <div />{" "}
                        <Collapse isOpen={index === isOpen}>
                          <div
                            className="pb-6"
                            dangerouslySetInnerHTML={{
                              __html: get(qa, "answer.html", ""),
                            }}
                          ></div>
                        </Collapse>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div>
              {data.items &&
                data.items.slice(splitAt).map((qa, index) => {
                  const i = index + splitAt;
                  return (
                    <div
                      key={i}
                      className="border-b border-white border-opacity-25"
                      onClick={() => {
                        isOpen !== i ? setIsOpen(i) : setIsOpen(null);
                      }}
                    >
                      <div className="grid grid-cols-[1rem,1fr,1rem] gap-3 py-5   cursor-pointer ">
                        <BsFillQuestionCircleFill className="mt-0.5" />
                        <h6 className="leading-none">
                          {get(qa, "question", "")}
                        </h6>
                        <BsCaretDownFill className="mt-0.5" />
                      </div>
                      <div className="grid grid-cols-[1rem,1fr,1rem] gap-3    opacity-80">
                        <div />{" "}
                        <Collapse isOpen={i === isOpen}>
                          <div
                            className="pb-6"
                            dangerouslySetInnerHTML={{
                              __html: get(qa, "answer.html", ""),
                            }}
                          ></div>
                        </Collapse>
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
