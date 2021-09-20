import React, { useEffect } from "react";
import isFunction from "lodash/isFunction";

import { Link } from "gatsby";

import LoadingIndicator from "@components/LoadingIndicator";
import { useForm, useWatch } from "react-hook-form";

import {
  ErrorMessage,
  Form,
  Input,
  Recaptcha,
  SubmitButton,
} from "@components/Form";

import * as yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import SocialLogin from "@components/SocialLogin";
import useAuth from "@api/useAuth";
import { useMutation } from "react-query";

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

export default function LoginForm({ onLogin, buttonLabel = "Sign In" }) {
  const { login } = useAuth();
  const intl = useIntl();
  const confirmationEmail = useMutation((email) => {
    return fetch(
      `${process.env.GATSBY_API_URL}/user/resend-email-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    ).then((res) => res.json());
  });
  useEffect(() => {
    if (login.isSuccess) {
      isFunction(onLogin) && onLogin();
    }
  }, [login.isSuccess]);
  const { control } = useForm();
  const email = useWatch({ name: "email", control });
  return (
    <>
      <SocialLogin />
      <div className="flex items-center mt-8 opacity-50 flex-nowrap">
        <div className="flex items-center flex-grow " aria-hidden="true">
          <div className="w-full border-t border-gray-300 " />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-lg font-medium text-white ">or</span>
        </div>
        <div className="flex items-center flex-grow " aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <Form
        schema={schema}
        className="grid gap-4 mt-10"
        onSubmit={(values) => {
          login.mutate(values);
        }}
      >
        <Input
          name="email"
          className="h-[50px]"
          required
          type="email"
          placeholder={intl.formatMessage({ id: "user.email_address" })}
        />
        <ErrorMessage name="email" />
        <Input
          name="password"
          required
          className="h-[50px]"
          type="password"
          placeholder={intl.formatMessage({ id: "user.password" })}
        />
        <ErrorMessage name="password" />

        {login?.error == "recaptcha-required" && (
          <Recaptcha type="login" enabled={true} />
        )}

        <div className="text-sm opacity-75 ">
          <Link to="/marketplace/forget-password" className="underline">
            <FormattedMessage id="user.forgot_password" />
          </Link>
        </div>

        <SubmitButton className="flex items-center space-x-2 h-[50px]">
          {" "}
          <span> {buttonLabel}</span>{" "}
          <LoadingIndicator isLoading={login.isLoading} />
        </SubmitButton>

        {login.isError && (
          <>
            {" "}
            <div className="text-sm text-center text-red ">
              {typeof login.error === "string" ? login.error : " "}{" "}
            </div>
            {!confirmationEmail.isSuccess &&
              login.error === "Email not confirmed" && (
                <div className="text-center">
                  <a
                    onClick={() => {
                      confirmationEmail.mutate(email);
                    }}
                    className="underline cursor-pointer"
                  >
                    <FormattedMessage id="user.click_to_send_confirmation_email" />
                  </a>
                </div>
              )}
            {confirmationEmail.isSuccess && (
              <div className="text-center">
                <FormattedMessage id="user.confirmation_email_sent" />
              </div>
            )}
          </>
        )}
      </Form>

      <div className="mt-4 space-y-2 text-center">
        {" "}
        <span className="text-sm ">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="underline">
            Privacy Policy{" "}
          </Link>
          . You may also receive promotional emails from Epik Prime. You can opt
          out at any time.
        </span>
      </div>
      <div className="mt-2 text-sm text-center ">
        <span className="opacity-75">
          {" "}
          <FormattedMessage id="user.dont_have_account" />
        </span>
        <Link
          to="/marketplace/signup"
          className="block mt-1 text-base font-semibold text-center underline"
        >
          <FormattedMessage id="user.sign_up" />
        </Link>
      </div>
    </>
  );
}
