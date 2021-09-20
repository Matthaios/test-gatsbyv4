import { css } from "@emotion/react";
import { graphql, StaticQuery } from "gatsby";
import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React, { useMemo } from "react";
import {
  //FaApple,
  //FaFacebookF,
  FaInstagram,
  //FaChevronRight,
  FaMediumM,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import Link from "./Link";

function Footer({ data }) {
  const menu = useMemo(() => {
    function recursive(items) {
      return items.map((item) => {
        let { link, label, subnav, target } = get(
          item,
          "link.document.data",
          {}
        );
        if (!subnav || (subnav && subnav.length === 0)) {
          subnav = undefined;
        } else {
          subnav = recursive(subnav);
        }
        return { link, label, subnav: subnav, target };
      });
    }

    let items = get(data, "prismicFooter.data.navigation");
    items = recursive(items);
    return { items };
  });
  const legal_links = useMemo(() => {
    function recursive(items) {
      return items.map((item) => {
        let { link, label, subnav, target } = get(
          item,
          "link.document.data",
          {}
        );
        if (!subnav || (subnav && subnav.length === 0)) {
          subnav = undefined;
        } else {
          subnav = recursive(subnav);
        }
        return { link, label, subnav: subnav, target };
      });
    }

    let items = get(data, "prismicFooter.data.legal_links");
    items = recursive(items);
    return { items };
  });
  const Logo = get(data, "prismicFooter.data.logo");

  return (
    <footer className="py-12 border-t border-white border-opacity-25 bg-dark print:hidden">
      <div className="container text-sm layout">
        <div className="a-logo">
          <div style={{ maxWidth: Logo.dimensions.width }}>
            <a href="/">
              {Logo.fluid && <GatsbyImage fluid={Logo.fluid} />}
              <img src={get(data, "prismicFooter.data.logo.")} />
            </a>
          </div>
        </div>
        <div className="footer-links-grid tablet:my-6 a-links">
          {menu.items &&
            menu.items.map((link, i) => {
              return (
                <div key={i}>
                  <Link
                    target={link.target}
                    className="hover:font-semibold"
                    to={link.link}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
        </div>
        <div
          className=" a-legal tablet:my-6"
          css={css`
            display: grid;
            row-gap: 1.5rem;
            column-gap: 1rem;
            grid-template: min-content / repeat(2, auto);
            grid-auto-rows: min-content;
            justify-content: start;

            @media (min-width: 640px) {
              grid-template: min-content / repeat(3, 150px);
            }
            @media (min-width: 768px) {
              grid-template: min-content / repeat(4, 150px);
            }
            @media (min-width: 1024px) {
              grid-template: min-content / 1fr;
            }
          `}
        >
          {legal_links.items &&
            legal_links.items.map((link, i) => {
              return (
                <div key={i}>
                  <Link
                    target={link.target}
                    className="hover:font-semibold"
                    to={link.link}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          {/*<LanguagePicker />*/}
        </div>
        <div>
          <div className="flex space-x-5 ">
            <a
              target={"_blank"}
              href={get(data, "prismicFooter.data.telegram_link")}
              className="block p-4 text-white rounded-full bg-primary"
            >
              <FaTelegramPlane />
            </a>
            <a
              target={"_blank"}
              href={get(data, "prismicFooter.data.twitter_link")}
              className="block p-4 text-white rounded-full bg-primary"
            >
              <FaTwitter />
            </a>
            <a
              target={"_blank"}
              href={get(data, "prismicFooter.data.instagram_link")}
              className="block p-4 text-white rounded-full bg-primary"
            >
              <FaInstagram />
            </a>
            <a
              target={"_blank"}
              href={get(data, "prismicFooter.data.medium_link")}
              className="block p-4 text-white rounded-full bg-primary"
            >
              <FaMediumM />
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-10 opacity-25">
          © Epik Pte. Ltd. 2018-{new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default () => (
  <StaticQuery
    query={graphql`
      {
        prismicFooter {
          data {
            apple_store_link
            facebook_link
            instagram_link
            medium_link
            google_store_link
            sign_up_now_link
            twitter_link
            telegram_link
            navigation {
              link {
                document {
                  ... on PrismicLink {
                    data {
                      link
                      label
                      target
                    }
                  }
                }
              }
            }
            legal_links {
              link {
                document {
                  ... on PrismicLink {
                    data {
                      link
                      label
                      target
                    }
                  }
                }
              }
            }
            logo {
              dimensions {
                width
              }
              fluid {
                ...GatsbyPrismicImageFluid
              }
            }
          }
        }
      }
    `}
    render={(data) => <Footer data={data} />}
  />
);
