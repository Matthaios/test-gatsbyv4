import { graphql, StaticQuery } from "gatsby";
import React from "react";
import Slider from "./Slider";
import Link from "./Link";
import GatsbyImage from "gatsby-image";
import { FaCommentDots } from "react-icons/fa";
import get from "lodash/get";

export default function NewGamesJoined() {
  return (
    <StaticQuery
      query={graphql`
        {
          newGames: allPrismicGame(limit: 20) {
            nodes {
              uid
              data {
                excerpt {
                  text
                }
                thumbnail {
                  fluid {
                    ...GatsbyPrismicImageFluid
                  }
                }
                title {
                  text
                }
              }
            }
          }
        }
      `}
      render={(data) => {
        const newGames = get(data, "newGames.nodes");
        return (
          <section>
            <div className="container">
              <Slider cols="4" title="New games joined">
                {newGames &&
                  newGames.length > 0 &&
                  newGames
                    //   items
                    .map((item, i) => {
                      const title = get(item, "data.title.text");
                      const excerpt = get(item, "data.excerpt.text");
                      return item ? (
                        <Link
                          to={`/game/${item.uid}`}
                          key={i}
                          className="pb-4 hover:border-b-2 border-primary"
                        >
                          <div className="relative h-40 overflow-hidden ">
                            {get(item, "data.thumbnail.fluid") && (
                              <GatsbyImage fluid={item.data.thumbnail.fluid} />
                            )}
                            {/*<div className="absolute top-0 right-0 p-2 mt-4 mr-4 text-xs leading-none rounded-full flex-center bg-primary">
                              7.5
                            </div>*/}
                          </div>
                          <div className="mt-2 p-opacity-80">
                            <h5 className="font-semibold">{title}</h5>
                            <p>
                              {excerpt?.split(" ")?.slice(0, 12).join(" ")}{" "}
                              {excerpt?.split(" ")?.length > 12 && "..."}
                            </p>
                            {/*<div className="flex items-center text-xs">
                              <FaCommentDots className="mr-2" />{" "}
                              <span>6 comments</span>
                            </div>*/}
                          </div>
                        </Link>
                      ) : null;
                    })}
              </Slider>
            </div>
          </section>
        );
      }}
    ></StaticQuery>
  );
}
