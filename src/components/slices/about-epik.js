import Link from "../Link";
import get from "lodash/get";
import React from "react";
import GatsbyImage from "gatsby-image";
import { FaChevronRight } from "react-icons/fa";

export default function AboutEpik({ data }) {
  const title = get(data, "primary.title.text", "");
  const sidebar_text = get(data, "primary.sidebar_text.html", "");
  const sidebar_title = get(data, "primary.sidebar_title.html", "");
  const sidebar_button_link = get(data, "primary.sidebar_button_link", "");
  const sidebar_button_text = get(data, "primary.sidebar_button_text");
  const component = get(data, "primary.sidebar_componente");
  const items = get(data, "items");
  return (
    <>
      <div className="section  section-t-sm">
        <div className="container  ">
          <div className="row gap-lg">
            <div className="col w-full lg:w-2/5  ">
              <div className="   py-20 tablet:flex tablet:flex-col items-start">
                <h2 className="font-semibold text-3xl mb-10">{title}</h2>
                {items &&
                  items.map((item, i) => {
                    return (
                      <div
                        key={i}
                        className="grid gap-6 grid-flow-col  auto-cols-auto mb-5  "
                      >
                        <div className="w-10">
                          {get(item, "icon.fluid") && (
                            <GatsbyImage fluid={item.icon.fluid} />
                          )}
                        </div>
                        <div className="prose space-y-2  prose-no-h-margins p-opacity-80">
                          <h5 className="font-semibold">{item.title}</h5>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="col w-full  tablet:max-w-2xl    lg:w-3/5 tablet:mb-10">
              <div className="bg-primary-dark  px-8 md:px-16   py-8 md:py-20 sidebar">
                {component === "We work with" ? (
                  <WeWorkWith
                    button_link={sidebar_button_link}
                    button_text={sidebar_button_text}
                    text={sidebar_title + sidebar_text}
                  />
                ) : (
                  <Newsletter text={sidebar_title + sidebar_text} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Newsletter({ text }) {
  return (
    <>
      <div
        className="prose  p-opacity-80 space-y-4"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      <form
        className="grid gap-4 mt-10"
        action="https://epikgg.typeform.com/to/RKYXMkMG"
        method="get"
      >
        <input
          type="hidden"
          id="typeform-welcome"
          name="typeform-welcome"
          value="0"
        />
        <input
          required
          type="email"
          id="email"
          name="email"
          placeholder="Email address"
        />
        <button className="">
          Sign Up Now <FaChevronRight className="ml-2" />
        </button>
      </form>
    </>
  );
}

function WeWorkWith({ text, button_text, button_link }) {
  return (
    <>
      <div
        className="prose  p-opacity-80 space-y-4"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      {button_text && (
        <Link to={button_link} className="button">
          {button_text}
        </Link>
      )}
    </>
  );
}
