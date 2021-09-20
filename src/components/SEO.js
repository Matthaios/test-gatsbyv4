import React from "react";
import Helmet from "react-helmet";
import get from "lodash.get";
import { graphql, StaticQuery } from "gatsby";

export default function Seo({ data }) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          seo: prismicPage(uid: { eq: "homepage" }) {
            data {
              meta_title
              meta_description
              meta_keywords
              meta_image {
                url
              }
            }
          }
        }
      `}
      render={({ site, seo }) => {
        const url =
          typeof window !== "undefined"
            ? window.location.href
            : get(site, "siteMetadata.siteUrl", "");
        const title = get(data, "meta_title", seo?.data?.meta_title);
        const description = get(
          data,
          "meta_description",
          seo?.data?.meta_description
        );
        const keywords = get(data, "meta_keywords", seo?.data?.meta_keywords);
        const image = get(data, "meta_image.url", seo?.data?.meta_image?.url);
        return (
          <>
            <Helmet>
              {url && <meta name="og:url" content={url} />}
              <html lang={"en"}></html>
              <meta name="og:type" content="article" />
              {title && <title>{title}</title>}
              {description && <meta name="description" content={description} />}
              {keywords && <meta name="keywords" content={keywords} />}
              {image && <meta name="image" content={image} />}
              {title && <meta property="og:title" content={title} />}
              {description && (
                <meta property="og:description" content={description} />
              )}
              {keywords && <meta property="og:keywords" content={keywords} />}
              {image && <meta property="og:image" content={image} />}
              {title && <meta name="twitter:title" content={title} />}
              {description && (
                <meta name="twitter:description" content={description} />
              )}
              {keywords && <meta name="twitter:keywords" content={keywords} />}
              {image && <meta name="twitter:image" content={image} />}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:creator" content={""} />
            </Helmet>
          </>
        );
      }}
    />
  );
}
