import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";

export default function Brands({ data }) {
  const title = get(data, "primary.title.html");
  return (
    <>
      <section className="section-sm">
        <div className="container">
          {title && (
            <div
              dangerouslySetInnerHTML={{ __html: title }}
              className="prose  prose-no-h-margins"
            ></div>
          )}
          {get(data, "primary.layout") === "Centered" ? (
            <Centered items={data.items} />
          ) : (
            <Grid items={data.items} />
          )}
        </div>
      </section>
    </>
  );
}

function Centered({ items }) {
  return (
    items && (
      <div className="px-20 brand-logos-centered">
        {items.map((item, i) => {
          return (
            <div
              key={i}
              style={{ width: get(item, "logos.dimensions.width", 200) }}
            >
              {get(item, "logos.fluid") && (
                <GatsbyImage fluid={item.logos.fluid} />
              )}
            </div>
          );
        })}
      </div>
    )
  );
}

function Grid({ items }) {
  return (
    items && (
      <div className=" brand-logos-grid">
        {items.map((item, i) => {
          return (
            <div
              className="max-w-full"
              style={{ width: get(item, "logos.dimensions.width", 200) }}
            >
              {get(item, "logos.fluid") && (
                <GatsbyImage fluid={item.logos.fluid} />
              )}
            </div>
          );
        })}
      </div>
    )
  );
}
