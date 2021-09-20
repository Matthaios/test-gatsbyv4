import get from "lodash/get";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

export default function Newsletter({ data }) {
  const text = get(data, "primary.text.html", "");
  const secondary_text = get(data, "primary.secondary_text.html", "");
  return (
    <>
      <div className="section ">
        <div className="container">
          <div className="row items-center">
            <div className="col w-full  tablet:max-w-2xl tablet:mx-auto  lg:w-1/2 tablet:mb-10">
              <div className="bg-primary-dark px-8 lg::px-16 py-8 lg:py-24">
                {" "}
                <div
                  className="prose  p-opacity-80 space-y-4"
                  dangerouslySetInnerHTML={{ __html: text }}
                ></div>
                <form
                  className="grid gap-4 mt-10"
                  action="https://epikgg.typeform.com/to/smt6qKRm"
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
              </div>
            </div>
            <div className="col w-full lg:w-1/2 md:!px-20 lg:!px-8">
              <div
                className="prose lg:px-16 p-opacity-80"
                dangerouslySetInnerHTML={{ __html: secondary_text }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
