import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React from "react";
import Robot from "../../images/robot-icons.svg";
export default function Team({ data }) {
  const items = get(data, "items");
  return (
    <>
      <section>
        <div className="container">
          <h2 className="text-3xl font-semibold">Team</h2>
          <div className="team-grid my-10">
            {items &&
              items.length > 0 &&
              items.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="item text-center py-10     space-y-3 "
                  >
                    <div className="w-28 h-28 md:w-32 md:h-32 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden border-4 md:border-8 border-primary relative">
                      <div className="overlay    absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 bg-primary      ">
                        <a href={item.link}>
                          {" "}
                          <img src={Robot} />
                        </a>
                      </div>
                      {get(item, "image.fixed") && (
                        <GatsbyImage
                          imgStyle={{ width: null, height: null }}
                          style={{ width: "100%", paddingBottom: "100%" }}
                          fixed={item.image.fixed}
                        />
                      )}
                    </div>
                    <div>
                      <h6 className="font-semibold md:text-xl">{item.name}</h6>
                      {item.position}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}
