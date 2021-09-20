import { ErrorMessage, Form, Input, Recaptcha } from "@components/Form";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import { parse } from "query-string";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation } from "react-query";
export default function ForgetPassword() {
  const location = useLocation();
  const searchParams = parse(location.search);
  const form = useForm();
  const { errors } = form.formState;
  const resetPassword = useMutation(async (credentials) => {
    return fetch(`${process.env.GATSBY_API_URL}/user/redefine-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...credentials, code: searchParams.id }),
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        const message = await res.json();
        if (message == "recaptcha-required") {
          throw "recaptcha-required";
        }
        throw "Error";
      }
    });
  });
  const intl = useIntl();

  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="py-16 lg:py-20">
        <div className="container max-w-2xl pt-12 pb-20 lg:pt-0 lg:pb-40">
          <div className="px-8 py-8 bg-primary-dark md:px-16 md:py-16">
            <div className="space-y-4 prose text-center p-opacity-80">
              <h1>
                {resetPassword.data?.success ? (
                  <FormattedMessage id="success" />
                ) : (
                  <FormattedMessage id="user.enter_new_password" />
                )}
              </h1>
              {resetPassword.data?.success && (
                <p>{resetPassword.data?.success}</p>
              )}
              {resetPassword.data?.success && (
                <p>
                  <Link className="button" to="/marketplace/login">
                    <FormattedMessage id="user.sign_in" />
                  </Link>
                </p>
              )}
            </div>
            {!resetPassword.data && (
              <>
                <Form
                  onSubmit={(values) => {
                    resetPassword.mutate(values);
                  }}
                  className="grid gap-4 mt-10"
                >
                  <Input
                    type="password"
                    name="new_password"
                    className="py-3"
                    options={{
                      required: intl.formatMessage({
                        id: "forms.required_field_message",
                      }),
                    }}
                    placeholder={intl.formatMessage({
                      id: "forms.new_password",
                    })}
                  />
                  <ErrorMessage name="new_password"></ErrorMessage>
                  {resetPassword?.error == "recaptcha-required" && (
                    <div>
                      {" "}
                      <Recaptcha type="redefinePassword" enabled={true} />
                    </div>
                  )}
                  <button className="flex items-center justify-center space-x-2">
                    <span>
                      <FormattedMessage id="send" />
                    </span>{" "}
                    <LoadingIndicator isLoading={resetPassword.isLoading} />
                  </button>
                  {resetPassword.error && (
                    <div className="text-sm text-center text-red">
                      {resetPassword?.error?.message || resetPassword?.error}
                    </div>
                  )}
                </Form>
                <div className="mt-8 space-y-2 text-sm text-center">
                  <div>
                    <Link
                      to="/marketplace/signup"
                      className="font-semibold underline"
                    >
                      <FormattedMessage id="user.create_account" />
                    </Link>
                    <span className="opacity-75">
                      {" "}
                      <FormattedMessage id="or" />{" "}
                    </span>
                    <Link
                      to="/marketplace/login"
                      className="font-semibold underline"
                    >
                      <FormattedMessage id="user.sign_in" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
