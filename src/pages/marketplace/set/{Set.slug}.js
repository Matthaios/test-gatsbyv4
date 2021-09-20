import Breadcrumbs from "@components/Breadcrumbs";
import { Set as SetEditions } from "@components/Collections";
import Layout from "@components/Layout";
import { graphql, navigate } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FormattedMessage } from "react-intl";

export default function Set({ data }) {
  return (
    <Layout>
      <div className="h-[100px] md:h-[180px]"></div>
      <div className="pb-20 mt-10 ">
        <div className="container">
          {" "}
          <Breadcrumbs>
            <span
              className="cursor-pointer"
              onClick={() => {
                window.history?.state?.key
                  ? window.history.back()
                  : navigate("/marketplace");
              }}
            >
              <MdKeyboardArrowLeft className="inline-block" />{" "}
              <FormattedMessage id="back" />
            </span>
          </Breadcrumbs>
        </div>
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
                image={data?.set?.blurred?.childImageSharp?.gatsbyImageData}
              />
              <GatsbyImage
                // aspectRatio={4 / 3}
                className="filter drop-shadow"
                style={{ height: 350 }}
                objectFit={"contain"}
                objectPosition={"center"}
                image={data?.set?.image_url?.childImageSharp?.gatsbyImageData}
              />
            </div>
            <div className="">
              <h1 className="text-4xl font-bold">{data?.set?.name}</h1>
              {data?.set?.subname ? <p>{data?.set?.subname}</p> : null}
              {data?.set?.description ? (
                <div
                  className="mt-4 prose-sm opacity-80"
                  dangerouslySetInnerHTML={{
                    __html: data?.set?.description?.html,
                  }}
                ></div>
              ) : null}
            </div>
          </div>
        </div>
        <SetEditions set={{ ...data.set, set_name: " \n" }} />
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ($id: String) {
    set(id: { eq: $id }) {
      ...Set
    }
  }

  fragment Set on Set {
    slug: gatsbyPath(filePath: "/marketplace/set/{Set.slug}")
    name: set_name
    description: set_description {
      text
      html
    }
    blurred: set_image_url {
      childImageSharp {
        gatsbyImageData(width: 40, aspectRatio: 1)
      }
    }
    image_url: set_image_url {
      childImageSharp {
        gatsbyImageData
      }
    }
    editions {
      ...Edition
    }
  }
`;
