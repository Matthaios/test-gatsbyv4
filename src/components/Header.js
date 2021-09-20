import useAuth from "@api/useAuth";
import Collapse from "@components/Collapse";
import { css } from "@emotion/react";
import { Menu } from "@headlessui/react";
import JwtAuth from "@utils/JwtAuth";
import cn from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { graphql, StaticQuery } from "gatsby";
import GatsbyImage from "gatsby-image";
import get from "lodash/get";
import React, { useEffect, useMemo, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { BsCaretDownFill, BsCollectionFill } from "react-icons/bs";
import {
  FaGem,
  FaGlasses,
  FaHeart,
  FaSignOutAlt,
  FaThList,
  FaUserAlt,
} from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { IoIosLogIn } from "react-icons/io";
import { RiAuctionFill } from "react-icons/ri";
import { FormattedMessage } from "react-intl";
import Link from "./Link";

function Header({ data }) {
  const [mobileIsOpen, setMobileIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const cookieToken = JwtAuth.getToken();
  const loggedIn = user || (cookieToken && isLoading);
  const menu = useMemo(() => {
    function recursive(items) {
      return items.map((item) => {
        let { link, label, subnav } = get(item, "link.document.data", {});

        if (!subnav || (subnav && subnav.length === 0)) {
          subnav = undefined;
        } else {
          subnav = recursive(subnav);
        }
        if (link == "/marketplace/profile") {
          subnav = !user
            ? undefined
            : [
                {
                  label: (
                    <>
                      {" "}
                      <FaUserAlt className="inline-block mr-2" />
                      Profile
                    </>
                  ),
                  link: "/marketplace/profile",
                },
                {
                  label: (
                    <>
                      {" "}
                      <FaGem className="inline-block mr-2" />
                      Items
                    </>
                  ),
                  link: "/marketplace/profile/items",
                },
                {
                  label: (
                    <>
                      {" "}
                      <FaThList className="inline-block mr-2" />
                      Orders
                    </>
                  ),
                  link: "/marketplace/profile/orders",
                },
                {
                  label: (
                    <>
                      {" "}
                      <BsCollectionFill className="inline-block mr-2" />
                      Collections
                    </>
                  ),
                  link: "/marketplace/profile/collections",
                },
                {
                  label: (
                    <>
                      {" "}
                      <RiAuctionFill className="inline-block mr-2" />
                      Auctions
                    </>
                  ),
                  link: "/marketplace/profile/auctions",
                },
                {
                  label: (
                    <>
                      {" "}
                      <BiTransfer className="inline-block mr-2" />
                      Transfers
                    </>
                  ),
                  link: "/marketplace/profile/transfers",
                },
                {
                  label: (
                    <>
                      {" "}
                      <FaSignOutAlt className="inline-block mr-2" />
                      <span> Sign Out</span>
                    </>
                  ),
                  action: () => {
                    logout();
                  },
                  link: "#",
                },
              ];
        }
        return { link, label, subnav: subnav };
      });
    }

    let items = get(data, "prismicHeader.data.navigation");
    items = recursive(items);
    return { items };
  }, [Boolean(user)]);
  const Logo = get(data, "prismicHeader.data.logo");

  return (
    <>
      <div className="absolute top-0 z-50 w-full py-6 md:pt-16 md:pb-8 print:hidden">
        <div className="container">
          <div className="flex items-center justify-between lg:flex-wrap">
            <Link
              to="/"
              className="block w-full tablet:w-24"
              style={{
                maxWidth: Logo.dimensions.width,
              }}
            >
              {Logo.fluid && <GatsbyImage alt="Epikprime" fluid={Logo.fluid} />}
            </Link>

            <DesktopMenu menu={menu} />

            <div className="relative z-50 p-4 -mr-4 lg:hidden">
              {loggedIn ? (
                <Link
                  to="/marketplace/profile"
                  className="inline cursor-pointer md:hidden"
                  // onClick={() => {
                  //   logout();
                  // }}
                >
                  Profile
                  {/* <FormattedMessage id="user.sign_out" /> */}
                </Link>
              ) : (
                <Link to="/marketplace/login" className="inline md:hidden">
                  <FormattedMessage id="user.sign_in" />
                </Link>
              )}
              {!mobileIsOpen && (
                <HiOutlineMenuAlt3
                  onClick={() => {
                    setMobileIsOpen(!mobileIsOpen);
                  }}
                  className="inline-block w-5 h-5 ml-4"
                />
              )}
              {mobileIsOpen && (
                <HiX
                  onClick={() => {
                    setMobileIsOpen(!mobileIsOpen);
                  }}
                  className="inline-block w-5 h-5 ml-4"
                />
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full tablet:hidden p">
          <div className="container">
            <div
              css={css`
                opacity: 0.1;
                border-bottom: 1px solid #ffffff;
              `}
            ></div>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileIsOpen}
        menu={menu}
        close={() => {
          setMobileIsOpen(false);
        }}
      />
    </>
  );
}
export default () => (
  <StaticQuery
    query={graphql`
      {
        prismicHeader {
          data {
            navigation {
              link {
                document {
                  ... on PrismicLink {
                    data {
                      link
                      label
                      target
                      subnav {
                        link: link1 {
                          document {
                            ... on PrismicLink {
                              data {
                                label
                                target
                                link
                                subnav {
                                  link: link1 {
                                    document {
                                      ... on PrismicLink {
                                        data {
                                          label
                                          target
                                          link
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
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
    render={(data) => <Header data={data} />}
  />
);

function DesktopMenu({ menu }) {
  return (
    <ul className="space-x-6 tablet:hidden lg:ml-auto">
      {[...menu.items].map(({ link, label, subnav, target }, i) => (
        <li className="relative inline-block " key={label}>
          {subnav && <Dropdown item={{ link, label, subnav }} />}
          {!subnav && (
            <Link
              to={link}
              target={target}
              activeClassName="font-semibold"
              className={cn(
                " flex items-center px-4 pb-2 pt-4 text-sm hover:font-semibold"
              )}
            >
              {label}{" "}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

const menuVariant = {
  visible: {
    x: 0,
    transition: {
      ease: "easeOut",
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
  hidden: {
    x: "100%",
    transition: {
      ease: "easeIn",
      staggerChildren: 0.1,
      delayChildren: -0.3,
    },
  },
};
const itemsVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
    x: 30,
    transition: {
      ease: "easeIn",
    },
  },
};
function MobileMenu({ menu, isOpen, close }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, [isOpen]);
  return (
    <motion.div
      className="fixed top-0 left-0 z-40 w-full h-full pt-24 pb-8 bg-primary-dark"
      initial="hidden"
      animate={isOpen ? "visible" : "hidden"}
      variants={menuVariant}
    >
      <div className="container h-full py-8 overflow-y-scroll text-center ">
        {menu.items &&
          menu.items.map((item) => {
            return (
              <motion.div
                variants={itemsVariants}
                key={item.link}
                className="py-4"
              >
                {!item.subnav && <Link to={item.link}>{item.label}</Link>}
                {item.subnav && (
                  <MobileMenuOverlay
                    trigger={
                      <Link
                        to={item.link}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {item.label}
                      </Link>
                    }
                  >
                    {item.subnav.map((item) => {
                      return (
                        <div className="py-2" key={item.label}>
                          {!item.subnav && (
                            <Link
                              to={item.link}
                              onClick={() => {
                                item?.action?.();
                              }}
                            >
                              {item.label}
                            </Link>
                          )}
                          {item.subnav && (
                            <MobileMenuOverlay
                              trigger={
                                <Link
                                  target={item.target}
                                  to={item.link}
                                  onClick={(e) => {
                                    item?.action?.();
                                  }}
                                >
                                  {item.label}
                                </Link>
                              }
                            >
                              {item.subnav.map((item) => {
                                return (
                                  <div className="py-2">
                                    <Link
                                      target={item.target}
                                      to={item.link}
                                      onClick={() => {
                                        item?.action?.();
                                      }}
                                    >
                                      {item.label}
                                    </Link>
                                  </div>
                                );
                              })}
                            </MobileMenuOverlay>
                          )}
                        </div>
                      );
                    })}
                  </MobileMenuOverlay>
                )}
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
}

function Dropdown({ item }) {
  return (
    <Menu>
      {({ open }) => {
        return (
          <>
            <Menu.Button className="inline-flex items-center justify-center space-x-2 focus:outline-none strip-button-styles">
              <span className="text-sm"> {item.label}</span>{" "}
              <BsCaretDownFill
                className={cn(
                  "text-sm transform transition-all duration-200 rotate-0",
                  {
                    "-rotate-180": open,
                  }
                )}
              />
            </Menu.Button>
            <Menu.Items
              style={{
                "--tw-drop-shadow":
                  "drop-shadow(0 10px 8px rgba(255,255,255, 0.1)) drop-shadow(0 4px 3px rgba(255,255,255, 0.06))",
              }}
              className="absolute z-10 right-0 top-12 w-auto min-w-[150px] filter drop-shadow-lg"
            >
              {item.subnav.map((navItem) => {
                return (
                  <Menu.Item
                    className="block !text-sm  px-4 py-2 pt-3 border-b-4 border-transparent bg-dark/90 hover:border-primary hover:bg-primary-dark/90"
                    key={item.label}
                  >
                    {({ active }) => (
                      <Link
                        onClick={() => {
                          navItem?.action?.();
                        }}
                        className={`${active && "border-primary"}`}
                        to={navItem.link}
                      >
                        {navItem.label}
                      </Link>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </>
        );
      }}
    </Menu>
  );
}

function MobileMenuOverlay({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              pointerEvents: "none",
              opacity: 0,
              height: 0,
              marginTop: 0,
              transition: { ease: "easeIn" },
            }}
            animate={{
              pointerEvents: "auto",
              opacity: 1,
              height: "auto",
              marginTop: 16,
              transition: { ease: "easeOut" },
            }}
            exit={{
              pointerEvents: "none",
              opacity: 0,
              height: 0,
              marginTop: 0,
              transition: { ease: "easeIn" },
            }}
            className="py-2 overflow-hidden bg-opacity-75 bg-primary shadow-glow"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function UserAuthItems({ close }) {
  const [user, setUser] = useState(null);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  function logout() {
    setUser(null);
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      function clickOutside(e) {
        if (!e.target.closest(".user-auth-ref") || e.target.closest("a")) {
          setDropdownIsOpen(false);
        }
      }
      document.addEventListener("click", clickOutside);
      return () => {
        document.removeEventListener("click", clickOutside);
      };
    }
  }, []);
  useEffect(() => {
    if (window !== undefined) {
      if (window.localStorage.getItem("auth")) {
        setUser({
          name: window.localStorage.getItem("userId"),
        });
      }
    }
  }, [typeof window !== "undefined" && window.localStorage.getItem("userId")]);

  return (
    <>
      {!user && (
        <>
          {" "}
          <Link
            to="/marketplace/login"
            className="inline-flex items-center space-x-2 text-sm tablet:inline-flex tablet:mb-4"
          >
            <IoIosLogIn />
            <span> Sign In</span>
          </Link>
          <br className="lg:hidden" />
          <Link
            to="/marketplace/signup"
            className="inline-flex items-center space-x-2 text-sm tablet:inline-flex"
          >
            <FaUserAlt className="w-3 h-3" />
            <span>Create Epik Account</span>
          </Link>
        </>
      )}
      {user && (
        <div className="relative text-sm user-auth-ref tablet:w-full">
          <div
            className="inline-flex items-center font-semibold cursor-pointer"
            onClick={() => {
              setDropdownIsOpen(!dropdownIsOpen);
            }}
          >
            <FaUserAlt className="mr-2" />
            {/* Hello, {user.name} */}
            <BsCaretDownFill className="ml-4" />
          </div>
          <div className="right-0 min-w-full overflow-hidden lg:absolute tablet:w-full">
            <Collapse isOpen={dropdownIsOpen}>
              <ul className="px-3 bg-opacity-75 divide-white bg-dark tablet:bg-primary shadow-glow lg:shadow-none lg:divide-y divide-opacity-25 tablet:mt-6 tablet:text-center">
                {" "}
                <li>
                  <Link
                    className="inline-flex items-center py-3 lg:opacity-50 hover:opacity-100"
                    to="/marketplace/favourites"
                    onClick={close}
                  >
                    {" "}
                    <FaHeart className="inline-block mr-2" />
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center py-3 lg:opacity-50 hover:opacity-100"
                    to="/marketplace/inventory"
                    onClick={close}
                  >
                    <FaGem className="inline-block mr-2" /> Items
                  </Link>
                </li>
                <li>
                  <a
                    className="inline-flex items-center py-3 lg:opacity-50 hover:opacity-100"
                    href="#"
                    onClick={close}
                  >
                    <FaGlasses className="inline-block mr-2" /> Whatchlist
                  </a>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center py-3 lg:opacity-50 hover:opacity-100"
                    to="/marketplace/profile"
                    onClick={close}
                  >
                    <FaUserAlt className="inline-block mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center py-3 lg:opacity-50 hover:opacity-100"
                    to="/marketplace/logout"
                    onClick={close}
                    onClick={logout}
                  >
                    <IoIosLogIn className="inline-block mr-2" /> Logout
                  </Link>
                </li>
              </ul>
            </Collapse>
          </div>
        </div>
      )}
    </>
  );
}
