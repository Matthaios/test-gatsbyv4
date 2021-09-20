import useAuth from "@api/useAuth";
import Layout from "@components/Layout";
import LoginForm from "@components/LoginForm";
import { useLocation } from "@reach/router";
import { navigate } from "gatsby";
import { parse } from "query-string";
import React from "react";
import { IoIosLogIn } from "react-icons/io";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("This has to be a valid email")
    .required("Required field"),

  password: yup.string().required("Required field"),
  tos: yup
    .bool()
    .oneOf(
      [true],
      "You must confirm that you have read and accepted the Privacy Policy and Cookies Policy to create an account."
    ),
});

export default function Login({}) {
  const location = useLocation();
  const searchParams = parse(location.search);
  const { data, isLoading } = useAuth();
  if (!isLoading && data) {
    typeof window !== "undefined" &&
      navigate(searchParams.redirect ?? "/marketplace");
  }

  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="container py-16 lg:py-20">
        <div className="container max-w-2xl pt-12 pb-20 lg:pt-0 lg:pb-40">
          <div className="px-8 py-8 bg-primary-dark md:px-16 md:py-16">
            <div className="space-y-4 prose text-center p-opacity-80">
              <h1 className="inline-flex ">
                <IoIosLogIn />
                <span className="pl-3">
                  <FormattedMessage id="user.sign_in" />
                </span>
              </h1>
            </div>{" "}
            <LoginForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
