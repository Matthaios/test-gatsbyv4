import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";
import Card, { truncate } from "@components/Card";
import ItemsGrid from "@components/ItemsGrid";
import { graphql, Link } from "gatsby";
import get from "lodash/get";
import { FormattedMessage } from "react-intl";
import hideAuctionItems from "@utils/hideAuctionItems";
export default function Collections({ data }) {
  return (
    <>
      <div className="py-10 bg-opacity-10 bg-primary-light">
        {" "}
        <div className="container grid gap-16 md:grid-cols-[380px,1fr] xl:grid-cols-[450px,1fr] md:items-center">
          <div className="relative">
            {" "}
            <GatsbyImage
              className="filter grayscale"
              aspectRatio={1}
              objectFit={"cover"}
              objectPosition={"center"}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                zIndex: 0,
                opacity: 0.2,
              }}
              image={
                data?.collection?.blurred?.childImageSharp?.gatsbyImageData
              }
            />
            <GatsbyImage
              // aspectRatio={4 / 3}
              className="filter drop-shadow"
              style={{ height: 350 }}
              objectFit={"contain"}
              objectPosition={"center"}
              image={
                data?.collection?.image_url?.childImageSharp?.gatsbyImageData
              }
            />
          </div>
          <div className="">
            <h1 className="text-4xl font-bold">{data?.collection?.name}</h1>
            {data?.collection?.subname ? (
              <p>{data?.collection?.subname}</p>
            ) : null}
            {data?.collection?.description ? (
              <div
                className="mt-4 prose-sm opacity-80"
                dangerouslySetInnerHTML={{
                  __html: data?.collection?.description?.html,
                }}
              ></div>
            ) : null}
          </div>
        </div>
      </div>
      {data?.collection?.page_type == "sets" ? (
        <div className="container mt-24">
          {" "}
          <ItemsGrid>
            {data?.collection?.sets?.map((set) => {
              return <SetPage set={set} />;
            })}
          </ItemsGrid>
        </div>
      ) : (
        data?.collection?.sets?.map((set) => {
          return <Set set={set} />;
        })
      )}
    </>
  );
}
export function Set({ set }) {
  return (
    <div className="container mt-16 ">
      <h2 className="mb-8 text-3xl lg:text-4xl lg:mb-16">
        {set.set_name || "Epik"}
      </h2>

      <ItemsGrid>
        {set?.editions.filter(hideAuctionItems)?.map((item, index) => (
          <Card isExtended key={index} data={item} />
        ))}
      </ItemsGrid>
    </div>
  );
}
export function SetPage({ set }) {
  return (
    <div>
      {" "}
      <Link
        to={set.slug}
        className={"relative block overflow-hidden h-52 xl:h-64"}
      >
        {" "}
        <GatsbyImage
          className="!absolute inset-0 w-full h-full"
          alt=""
          imgStyle={{ width: "100%", height: "100%" }}
          objectFit="cover"
          image={set?.image_url?.childImageSharp?.gatsbyImageData}
        />
      </Link>{" "}
      <div className="mt-4 ">
        <h3 className="mb-1 text-base font-semibold">{set.name}</h3>
        <p className="overflow-hidden prose-sm opacity-75">
          {truncate(get(set, "description.text", ""))}
        </p>
        <div className="flex flex-col items-start xl:flex-wrap xl:items-center xl:flex-row">
          <Link to={set.slug} className="mt-3 text-sm cursor-pointer button">
            <FormattedMessage id="learn_more" />
          </Link>
        </div>
      </div>
    </div>
  );
}
