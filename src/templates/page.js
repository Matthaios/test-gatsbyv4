import loadable from "@loadable/component";
import { graphql } from "gatsby";
import get from "lodash/get";
import React from "react";
import Layout from "@components/Layout";
import Seo from "@components/SEO";
const HeroV1 = loadable(() => import("@components/slices/hero-v1"));
const HeroV2 = loadable(() => import("@components/slices/hero-v2"));
const ContentV1 = loadable(() => import("@components/slices/content-v1"));
const ContentV2 = loadable(() => import("@components/slices/content-v2"));
const ContentV3 = loadable(() => import("@components/slices/content-v3"));
const Newsletter = loadable(() => import("@components/slices/newsletter"));
const HowEpicWorks = loadable(() =>
  import("@components/slices/how-epic-works")
);
const RecentWork = loadable(() => import("@components/slices/recent-work"));
const NewBrands = loadable(() => import("@components/slices/new-brands"));
const UpcomingEvents = loadable(() =>
  import("@components/slices/upcoming-events")
);
const AboutEpik = loadable(() => import("@components/slices/about-epik"));
const Statistics = loadable(() => import("@components/slices/statistics"));
const Brands = loadable(() => import("@components/slices/brands"));
const Map = loadable(() => import("@components/slices/map"));
const Team = loadable(() => import("@components/slices/team"));
const Testimonials = loadable(() => import("@components/slices/testimonials"));
const Business = loadable(() => import("@components/slices/business"));
const ContactForm = loadable(() => import("@components/slices/contact-form"));
const LinksSection = loadable(() => import("@components/slices/links-section"));
const Faq = loadable(() => import("@components/slices/faq"));
const Model = loadable(() => import("@components/slices/model"));

export default function Page({ data }) {
  const slices = get(data, "prismicPage.data.body");
  return (
    <Layout>
      <Seo data={get(data, "seo.data")} />
      {slices
        ? slices.map((slice, index) => {
            switch (slice.__typename) {
              case "PrismicPageDataBodyHero":
                return <HeroV1 key={index} data={slice} />;
              case "PrismicPageDataBodyHeroV2":
                return <HeroV2 key={index} data={slice} />;
              case "PrismicPageDataBodyContentV1":
                return <ContentV1 key={index} data={slice} />;
              case "PrismicPageDataBodyContentV2":
                return <ContentV2 key={index} data={slice} />;
              case "PrismicPageDataBodyConentV3":
                return <ContentV3 key={index} data={slice} />;
              case "PrismicPageDataBodyHowEpicWorks":
                return <HowEpicWorks key={index} data={slice} />;
              case "PrismicPageDataBodyNewsletter":
                return <Newsletter key={index} data={slice} />;
              case "PrismicPageDataBodyAboutEpik":
                return <AboutEpik key={index} data={slice} />;
              case "PrismicPageDataBodyStatistics":
                return <Statistics key={index} data={slice} />;
              case "PrismicPageDataBodyBrands":
                return <Brands key={index} data={slice} />;
              case "PrismicPageDataBodyTeam":
                return <Team key={index} data={slice} />;
              case "PrismicPageDataBodyTestimonials":
                return <Testimonials key={index} data={slice} />;
              case "PrismicPageDataBodyBusiness":
                return <Business key={index} data={slice} />;

              case "PrismicPageDataBodyRecentWork":
                return <RecentWork key={index} data={slice} />;
              case "PrismicPageDataBodyUpcomingEvents":
                return <UpcomingEvents key={index} data={slice} />;
              case "PrismicPageDataBodyNewBrands":
                return <NewBrands key={index} data={slice} />;
              case "PrismicPageDataBodyMap":
                return <Map key={index} data={slice} />;
              case "PrismicPageDataBodyContactForm":
                return <ContactForm key={index} data={slice} />;
              case "PrismicPageDataBodyLinksSection":
                return <LinksSection key={index} data={slice} />;
              case "PrismicPageDataBodyFaq":
                return <Faq key={index} data={slice} />;
              case "PrismicPageDataBodyModel":
                return <Model key={index} data={slice} />;
              default:
                return <pre>{JSON.stringify(slice, null, 2)}</pre>;
            }
          })
        : null}
    </Layout>
  );
}
export const query = graphql`
  query ($uid: String!) {
    seo: prismicPage(uid: { eq: $uid }) {
      data {
        meta_title
        meta_description
        meta_keywords
        meta_image {
          url
        }
      }
    }
    prismicPage(uid: { eq: $uid }) {
      uid
      data {
        body {
          __typename

          ... on PrismicPageDataBodyHero {
            id
            primary {
              background_image {
                fluid(imgixParams: { q: 90 }) {
                  ...GatsbyPrismicImageFluid
                }
              }
              title {
                html
                text
              }
            }
          }
          ... on PrismicPageDataBodyHeroV2 {
            ...HeroV2
          }
          ... on PrismicPageDataBodyContentV1 {
            id
            slice_type
            primary {
              button_link
              button_text
              image {
                alt
                fluid(imgixParams: { q: 90 }) {
                  ...GatsbyPrismicImageFluid
                }
              }
              text {
                html
              }
              text_side
            }
          }
          ... on PrismicPageDataBodyContentV2 {
            id
            primary {
              button_link
              button_text
              text_side
              image {
                alt
                dimensions {
                  width
                }
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
              text {
                html
              }
            }
          }
          ... on PrismicPageDataBodyHowEpicWorks {
            id
            items {
              point_text
              point_title
            }
            primary {
              title {
                html
              }
            }
          }
          ... on PrismicPageDataBodyConentV3 {
            primary {
              button_label
              button_link
              text_aligned
              text {
                html
              }
              image {
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
            }
          }
          ... on PrismicPageDataBodyNewsletter {
            primary {
              secondary_text {
                html
              }
              text {
                html
              }
            }
          }
          ... on PrismicPageDataBodyRecentWork {
            id
            primary {
              title: title1 {
                text
              }
            }
            items {
              item {
                uid
                document {
                  ... on PrismicPost {
                    data {
                      thumbnail: featured_image {
                        fluid(imgixParams: { q: 90 }) {
                          ...GatsbyPrismicImageFluid
                        }
                      }
                      date(formatString: "DD/MM/YYYY")
                      name: title {
                        text
                      }
                      excerpt {
                        html
                      }
                    }
                    uid
                  }
                }
              }
            }
          }
          ... on PrismicPageDataBodyNewBrands {
            id
            primary {
              background
              text {
                html
              }
              title {
                html
              }
            }
            items {
              logo {
                dimensions {
                  width
                }
                fluid(
                  imgixParams: { h: 150, w: 150, fit: "fill" }
                  maxWidth: 150
                ) {
                  ...GatsbyPrismicImageFluid
                }
              }
            }
          }
          ... on PrismicPageDataBodyAboutEpik {
            id
            items {
              text
              icon {
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
              title
            }
            primary {
              title {
                text
              }
              sidebar_text {
                html
              }
              sidebar_title {
                html
              }
              sidebar_componente
              sidebar_button_text
              sidebar_button_link
            }
          }
          ... on PrismicPageDataBodyBrands {
            id
            items {
              logos {
                dimensions {
                  width
                }
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
            }
            primary {
              layout
              title {
                html
              }
            }
          }
          ... on PrismicPageDataBodyUpcomingEvents {
            id
            primary {
              title {
                text
              }
            }
            items {
              item {
                document {
                  ... on PrismicPost {
                    data {
                      thumbnail: featured_image {
                        fluid(imgixParams: { q: 90 }) {
                          ...GatsbyPrismicImageFluid
                        }
                      }
                      date(formatString: "DD/MM/YYYY")
                      title {
                        text
                      }
                      excerpt {
                        text
                      }
                    }
                    uid
                  }
                }
              }
            }
          }
          ... on PrismicPageDataBodyTeam {
            id
            items {
              position
              name
              link
              image {
                fixed(height: 200, width: 200) {
                  ...GatsbyPrismicImageFixed
                }
              }
            }
          }
          ... on PrismicPageDataBodyTestimonials {
            id
            primary {
              image {
                fluid {
                  ...GatsbyPrismicImageFluid
                }
                alt
              }
            }
            items {
              testimonial {
                html
              }
            }
          }
          ... on PrismicPageDataBodyBusiness {
            id
            items {
              column
              image {
                url
              }
              column_text: text {
                html
              }
            }
            primary {
              title: title1 {
                html
              }
              right_column_title
              left_column_title
              left_column_image {
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
              right_column_image {
                fluid {
                  ...GatsbyPrismicImageFluid
                }
              }
            }
          }
          ... on PrismicPageDataBodyStatistics {
            id
            items {
              label
              numbers
            }
          }
          ... on PrismicPageDataBodyMap {
            id
            primary {
              zoom
              latitude
              longitude
            }
          }
          ... on PrismicPageDataBodyContactForm {
            id
            primary {
              text {
                html
              }
            }
          }
          ... on PrismicPageDataBodyLinksSection {
            id
            primary {
              title: title1 {
                html
              }
            }
            items {
              text_columns {
                html
              }
            }
          }
          ... on PrismicPageDataBodyFaq {
            id
            primary {
              title: title1 {
                html
              }
            }
            items {
              question
              answer {
                html
              }
            }
          }
          ... on PrismicPageDataBodyModel {
            id
            primary {
              title1 {
                html
              }
            }
            items {
              first_column_centered
              col1
              col2
              col3
              col4
              col5
              col6
              col7
            }
          }
        }
      }
    }
  }

  fragment EventDetails on PrismicEvent {
    id
    uid
    data {
      name {
        text
      }
      background {
        fluid(maxWidth: 500, maxHeight: 500) {
          ...GatsbyPrismicImageFluid
        }
      }
      thumbnail {
        fluid(maxWidth: 500, maxHeight: 500) {
          ...GatsbyPrismicImageFluid
        }
      }

      end_date(formatString: "MMMM D, YYYY")
      release_date(formatString: "MMMM D, YYYY")
      region
      platforms
      logo_group {
        logo {
          dimensions {
            width
          }
          fluid(maxWidth: 100) {
            ...GatsbyPrismicImageFluid
          }
        }
        logo_link {
          type
          uid
        }
      }
      game {
        uid
        document {
          ... on PrismicGame {
            id
            data {
              title {
                text
              }
            }
          }
        }
      }
      brand_owner {
        document {
          ... on PrismicBrandOwner {
            id
            uid
            data {
              name {
                text
              }
            }
          }
        }
      }
      game_publisher {
        uid
        document {
          ... on PrismicPublisher {
            id
            uid
            data {
              name {
                text
              }
            }
          }
        }
      }

      brand {
        uid
        document {
          ... on PrismicBrand {
            id
            data {
              name {
                text
              }
            }
          }
        }
      }
      item_list {
        item {
          document {
            ... on PrismicItem {
              id
              data {
                background_image {
                  fixed(height: 100, width: 100) {
                    ...GatsbyPrismicImageFixed
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
