import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import { useLocation } from "@reach/router";
import JwtAuth from "@utils/JwtAuth";
import { Link, navigate } from "gatsby";
import { parse } from "query-string";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
export default function EmailConfirmation() {
  const form = useForm();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { cc, rc } = parse(location.search);
  const { errors } = form.formState;
  const sendCode = useMutation(async (credentials) => {
    return fetch(`${process.env.GATSBY_API_URL}/user/email-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        const message = await res.json();

        throw Error(message.error);
      }
    });
  });
  useEffect(() => {
    if (cc) {
      sendCode
        .mutateAsync({ email_code: cc })
        .then((res) => {
          if (res.error) {
            throw new Error(res.error);
          } else {
            if (res.token) {
              queryClient.setQueryData("token", {
                token: res.token,
                userId: res.user_id,
              });
              JwtAuth.setToken(res.token, res.user_id);
              queryClient.invalidateQueries("auth");
            }

            if (rc) {
              navigate(
                `/marketplace/login?redirect=/marketplace/redeem?rc=${rc}`
              );
            } else {
              navigate(`/marketplace/login`);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [cc]);
  const intl = useIntl();
  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="py-16 lg:py-20">
        <div className="container max-w-2xl pt-12 pb-20 lg:pt-0 lg:pb-40">
          <div className="px-8 py-8 bg-primary-dark md:px-16 md:py-16">
            {cc && (
              <div className="space-y-4 prose text-center p-opacity-80">
                <h1>
                  {sendCode?.data?.success ? (
                    sendCode?.data?.success
                  ) : (
                    <>
                      <FormattedMessage id="user.confirm_your_email" />
                      <LoadingIndicator isLoading={sendCode.isLoading} />
                    </>
                  )}
                </h1>
                {sendCode.data?.error && (
                  <div className="text-sm text-center text-red">
                    {sendCode.data?.error}
                  </div>
                )}
                {sendCode.data?.error === "Email previously confirmed" && (
                  <Link
                    className="mt-2 button"
                    to={
                      rc
                        ? `/marketplace/login?redirect=/marketplace/redeem?rc=${rc}`
                        : `/marketplace/login`
                    }
                  >
                    <FormattedMessage id="user.sign_in" />
                  </Link>
                )}
              </div>
            )}
            {!cc && (
              <>
                <div className="space-y-4 prose text-center p-opacity-80">
                  <h1>
                    {sendCode?.data?.success ? (
                      sendCode?.data?.success
                    ) : (
                      <FormattedMessage id="user.enter_confirmation_code" />
                    )}
                  </h1>
                </div>

                <form
                  onSubmit={form.handleSubmit((values) => {
                    sendCode
                      .mutateAsync(values)
                      .then((res) => {
                        if (sendCode?.data?.success) {
                          navigate("/marketplace/login");
                        }
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  })}
                  className="grid gap-4 mt-10"
                >
                  <input
                    className="py-3"
                    {...form.register("email_code", {
                      required: intl.formatMessage({
                        id: "forms.required_field_message",
                      }),
                    })}
                    placeholder={intl.formatMessage({
                      id: "forms.confirmation_code",
                    })}
                  />
                  {errors.email_code && (
                    <div className="text-sm text-red">
                      {errors.email_code.message}
                    </div>
                  )}
                  <button className="flex items-center justify-center space-x-2">
                    <span>
                      <FormattedMessage id="send" />
                    </span>{" "}
                    {sendCode.isLoading && <LoadingIndicator />}
                  </button>
                  {sendCode.data?.error && (
                    <div className="text-sm text-center text-red">
                      {sendCode.data?.error}
                    </div>
                  )}
                  {sendCode.error?.message && (
                    <div className="text-sm text-center text-red">
                      {sendCode.error?.message}
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
