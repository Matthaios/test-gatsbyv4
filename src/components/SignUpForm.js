import useAuth from "@api/useAuth";
import LoadingIndicator from "@components/LoadingIndicator";
import { Link } from "gatsby";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

import * as yup from "yup";

import {
  Form,
  Input,
  ErrorMessage,
  SubmitButton,
  Recaptcha,
} from "@components/Form";
import { FormattedMessage, useIntl } from "react-intl";
import { PasswordRegex } from "@utils/regex";
import SocialLogin from "@components/SocialLogin";

const useSchema = () => {
  const intl = useIntl();
  return yup.object().shape({
    email: yup
      .string()
      .email(intl.formatMessage({ id: "forms.valid_email_message" }))
      .required(intl.formatMessage({ id: "forms.required_field_message" })),

    password: yup
      .string()
      .min(8, intl.formatMessage({ id: "forms.password_short_message" }))
      .max(100, intl.formatMessage({ id: "forms.password_long_message" }))
      .required(intl.formatMessage({ id: "forms.required_field_message" }))
      .matches(
        PasswordRegex,
        intl.formatMessage({ id: "forms.password_rules" })
      ),
  });
};

export default function SignUpForm({
  redemption_code,
  isRedemption,
  loginRedirect = "/marketplace/redeem",
  signUpRedirect,
}) {
  const { signUp } = useAuth();

  const schema = useSchema();
  const intl = useIntl();

  const [formIsOpen, setFormIsOpen] = useState(false);
  return (
    <>
      {signUp.isSuccess && (
        <div className="mt-8 prose">
          <h4>
            {" "}
            <FormattedMessage id="forms.account_created_successfully" />
          </h4>
          <p>
            <FormattedMessage id="forms.check_your_email_message" />
          </p>
        </div>
      )}
      {!signUp.isSuccess && (
        <>
          <SocialLogin type="register" redirect={signUpRedirect} />

          {!isRedemption && (
            <>
              {!formIsOpen && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setFormIsOpen(true);
                    }}
                  >
                    <FaEnvelope className="mr-2 " /> Email
                  </button>
                </div>
              )}
              {formIsOpen && (
                <Form
                  schema={schema}
                  className="grid gap-4 auto-rows-[minmax(50px,auto)] mt-10"
                  onSubmit={(values) => {
                    signUp.mutate({ ...values, redemption_code });
                  }}
                >
                  <div className="space-y-2">
                    <Input
                      name="email"
                      className="h-[50px] w-full"
                      required
                      type="email"
                      placeholder={intl.formatMessage({
                        id: "user.email_address",
                      })}
                    />
                    <ErrorMessage name="email" />
                  </div>
                  <div className="space-y-2">
                    <Input
                      name="password"
                      className="w-full block h-[50px]"
                      type="password"
                      placeholder={intl.formatMessage({
                        id: "user.password",
                      })}
                    />
                    <ErrorMessage name="password" />
                  </div>
                  <Recaptcha
                    type="registration"
                    enabled={signUp?.error == "recaptcha-required"}
                  />

                  <SubmitButton
                    className="flex items-center space-x-2"
                    type="submit"
                  >
                    <span>
                      {" "}
                      <FormattedMessage id="user.sign_up" />
                    </span>{" "}
                    <LoadingIndicator isLoading={signUp.isLoading} />
                  </SubmitButton>
                  {signUp.isError && (
                    <div className="text-sm text-center text-red ">
                      {signUp.error}
                    </div>
                  )}
                </Form>
              )}
            </>
          )}
          <div className="mt-5 space-y-2 text-center">
            {" "}
            <span className="text-sm ">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy{" "}
              </Link>
              . You may also receive promotional emails from Epik Prime. You can
              opt out at any time.
            </span>
          </div>
          <div class="text-sm  text-center mt-4">
            <span class="opacity-75">
              <FormattedMessage id="forms.have_epik_account" />{" "}
            </span>
            <div class=" text-base font-semibold mt-1">
              <Link class="underline" to={loginRedirect}>
                <FormattedMessage id="user.sign_in" />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
