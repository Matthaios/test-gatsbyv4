import useAuth from "@api/useAuth";
import useCart from "@api/useCart";
import Link from "@components/Link";
import JwtAuth from "@utils/JwtAuth";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { SubtleBonusNotification } from "./UnlockedItemNotification";

export default function Topbar() {
  const { data } = useCart();
  const { user, data: auth, logout, isLoading } = useAuth();
  const cookieToken = JwtAuth.getToken();
  const loggedIn = auth || (cookieToken && isLoading);

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full phone:hidden print:hidden"
        style={{ zIndex: 1000 }}
      >
        <div className="container flex items-center justify-end space-x-8">
          <SubtleBonusNotification />
          {loggedIn ? (
            <span
              className="px-3 py-4 cursor-pointer"
              // onClick={() => {
              //   logout();

              // }}
            ></span>
          ) : (
            <div className="px-3 py-4">
              {" "}
              <Link to="/marketplace/login">Sign In</Link>
            </div>
          )}
          {data?.length > 0 ? (
            <Link
              to="/marketplace/cart"
              className="flex items-center px-6 py-4 space-x-3 bg-primary"
            >
              <FaShoppingCart /> <span>{data?.length} Items</span>
            </Link>
          ) : null}
        </div>
      </div>
      {data?.length > 0 ? (
        <div className="fixed bottom-0 left-0 z-40 w-full max-w-screen md:hidden">
          <div>
            <SubtleBonusNotification />
          </div>
          <Link
            to="/marketplace/cart"
            className="block w-full py-2 text-sm bg-primary"
          >
            {" "}
            <div className="container flex items-center space-x-3 ">
              <FaShoppingCart /> <span>{data?.length} Items</span>{" "}
              <MdKeyboardArrowRight className="!ml-auto" />
            </div>
          </Link>
        </div>
      ) : null}
    </>
  );
}
