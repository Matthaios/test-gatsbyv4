import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";
import TestimonialSlider from "../TestimonialSlider";
export default function Testimonials({ data }) {
  const image = get(data, "primary.image.fluid");
  return (
    <>
      <section>
        <div className="container">
          <div className="row  ">
            <div className="col w-full  md:w-1/2 lg:w-1/3">
              {image && <GatsbyImage fluid={image} />}
            </div>
            <div className="col w-full md:w-1/2 lg:w-2/3 phone:mt-8  mt-6">
              <TestimonialSlider>
                {data.items &&
                  data.items.length > 0 &&
                  data.items.map((item, index) => {
                    return (
                      <div
                        className="prose prose-no-h-margins"
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: get(item, "testimonial.html", ""),
                        }}
                      ></div>
                    );
                  })}
              </TestimonialSlider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
