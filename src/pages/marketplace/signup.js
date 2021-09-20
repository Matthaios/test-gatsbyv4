import useAuth from "@api/useAuth";
import Layout from "@components/Layout";
import SignUpForm from "@components/SignUpForm";
import { navigate } from "gatsby";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export default function Signup() {
  const { token } = useAuth();
  if (token) {
    typeof window !== "undefined" && navigate("/marketplace/profile");
  }

  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="container py-16 lg:py-20">
        <div className="container max-w-2xl pt-12 pb-20 lg:pt-0 lg:pb-40">
          <div className="px-8 py-8 bg-primary-dark md:px-16 md:py-16">
            <div className="space-y-4 prose p-opacity-80">
              <h1 className="inline-flex text-center">
                <FaUserAlt />
                <span className="pl-3">
                  <FormattedMessage id="forms.create_epik_account" />
                </span>
              </h1>
            </div>
            <SignUpForm
              loginRedirect="/marketplace/login"
              signUpRedirect="/marketplace"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
