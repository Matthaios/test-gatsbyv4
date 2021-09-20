import { ErrorMessage, Form, Input, SubmitButton } from "@components/Form";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import { Link } from "gatsby";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation } from "react-query";
import * as yup from "yup";

const useSchema = () => {
  const intl = useIntl();
  return yup.object().shape({
    email: yup
      .string()
      .email(intl.formatMessage({ id: "forms.valid_email_message" }))
      .required(intl.formatMessage({ id: "forms.required_field_message" })),
  });
};

export default function ForgetPassword() {
  const form = useForm();
  const { errors } = form.formState;
  const sendEmail = useMutation(async (credentials) => {
    return fetch(`${process.env.GATSBY_API_URL}/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then(async (res) => {
      return `<p>If an account exists for the email <a href="mailto:${credentials.email}">${credentials.email}</a>, we will send an email to that address with instructions to reset your password.</p><p>Please check your email for instructions.</p>`;
    });
  });
  const intl = useIntl();
  const schema = useSchema();
  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="py-16 lg:py-20">
        <div className="container max-w-2xl pt-12 pb-20 lg:pt-0 lg:pb-40">
          <div className="px-8 py-8 bg-primary-dark md:px-16 md:py-16">
            <div className="space-y-4 prose text-center ">
              <div>
                <h1>{sendEmail.data ? "Email sent" : "Forgot Password?"}</h1>
                {!sendEmail.data && <p>Enter your email!</p>}
              </div>
              {sendEmail.data && (
                <div dangerouslySetInnerHTML={{ __html: sendEmail.data }}></div>
              )}
            </div>
            {!sendEmail.data && (
              <Form
                onSubmit={(values) => {
                  sendEmail.mutate(values);
                }}
                schema={schema}
                className="grid gap-4 mt-10"
              >
                <Input
                  className="py-3"
                  name="email"
                  placeholder="Email Address"
                />

                <ErrorMessage name="email" />
                <SubmitButton className="flex items-center justify-center space-x-2">
                  <span>
                    <FormattedMessage id="send" />
                  </span>{" "}
                  <LoadingIndicator isLoading={sendEmail.isLoading} />
                </SubmitButton>
                {sendEmail.error && (
                  <div className="text-sm text-center text-red">
                    {sendEmail.error.message}
                  </div>
                )}
                <div className="space-y-2 text-sm text-center ">
                  <div>
                    <span className="opacity-75">
                      <FormattedMessage id="new_to_epik" />
                    </span>
                    <br />{" "}
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
              </Form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
