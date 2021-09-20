import useAuth from "@api/useAuth";
import { useEdition } from "@api/useItems";
import { CardImage } from "@components/Card";
import DescriptionCollapse from "@components/DescriptionCollapse";
import { Form, Recaptcha, SubmitButton } from "@components/Form";
import Layout from "@components/Layout";
import Link from "@components/Link";
import LoadingIndicator from "@components/LoadingIndicator";
import SignUpForm from "@components/SignUpForm";
import { useLocation } from "@reach/router";
import JwtAuth from "@utils/JwtAuth";
import { navigate } from "gatsby-link";
import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useQueryClient } from "react-query";

export default function Redeem({}) {
  const location = useLocation();
  const { rc: code } = parse(location.search);
  const intl = useIntl();
  const [captcha, setCaptcha] = useState(undefined);
  const item = useQuery(
    ["redeem-account", captcha],
    () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/user/check-redemption-code/${code}${
          captcha ? "?captcha=" + captcha : ""
        }`
      ).then(async (res) => {
        if (res.status === 204) {
          throw Error(
            intl.formatMessage({ id: "redeem.invalid_redemption_code" })
          );
        }
        const data = await res.json();
        if (data === "recaptcha-required") {
          throw "recaptcha-required";
        }
        if (data.error) {
          throw new Error(data.error);
        } else {
          return data;
        }
      });
    },
    {
      enabled: Boolean(code),
      retry: 0,
    }
  );

  useEffect(() => {
    if (!code) {
      item.remove();
    }
  }, [code]);

  return (
    <Layout>
      <div className="hero-spacer"></div>
      <div className="container md:py-16 lg:py-20">
        <div className="pt-12 pb-20 xl:px-16 lg:pt-0 lg:pb-40">
          <LoadingIndicator isLoading={item.isLoading} robot />

          {!code && <RedeemForm item={item} />}
          {code && item.error == "recaptcha-required" && (
            <div className="max-w-lg px-6 py-10 mx-auto bg-primary-dark md:px-16 md:py-20">
              <Form
                onSubmit={({ captcha }) => {
                  setCaptcha(captcha);
                }}
                className="text-center"
              >
                <div className="mb-4 prose max-w-none">
                  <h1>Security Check</h1>
                </div>
                <Recaptcha type="redeem" enabled />
                <SubmitButton>Send</SubmitButton>
              </Form>
            </div>
          )}
          {code && item?.data?.status === "error" && !item?.data?.edition && (
            <InvalidRedemptionCode error={item.data} />
          )}
          {code && item.data && <RedemtionItem item={item} data={item.data} />}
        </div>
      </div>
    </Layout>
  );
}

function RedeemForm({ item }) {
  const form = useForm();
  const intl = useIntl();

  return (
    <div className="max-w-lg px-6 py-10 mx-auto bg-primary-dark md:px-16 md:py-20">
      {item.data === "Item redeemed succesfully" ? (
        <RedeemItemStates />
      ) : (
        <>
          <h1 className="mb-3 text-3xl">
            <FormattedMessage id="redeem.title" />
          </h1>
          <p>
            <FormattedMessage id="redeem.text" />
          </p>
          <form
            className="grid gap-4 mt-6 grid-rows-[50px]"
            onSubmit={form.handleSubmit(({ code }) => {
              navigate(`/marketplace/redeem?rc=${code}`);
            })}
          >
            <input
              type="text"
              minLength="16"
              maxLength="16"
              {...form.register("code", { required: true })}
              placeholder={intl.formatMessage({ id: "redeem.input" })}
            />

            <button>
              <FormattedMessage id="redeem.button" />{" "}
              <LoadingIndicator isLoading={item.isLoading} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function InvalidRedemptionCode({ error }) {
  return (
    <div className="max-w-lg px-16 py-20 mx-auto space-y-3 bg-primary-dark">
      <h1 className="text-3xl ">
        {" "}
        <FormattedMessage id="redeem.error_with_code" />{" "}
      </h1>
      <p className="text-red">{error.message}</p>
      <p>
        <Link to="/marketplace/redeem" className="button">
          <FormattedMessage id="redeem.enter_code_again" />
        </Link>
      </p>
    </div>
  );
}
function RedemtionItem({ data }) {
  const { user } = useAuth();
  const location = useLocation();
  const { edition } = useEdition(data?.edition?.edition_id);
  const { rc: code } = parse(location.search);
  const queryClient = useQueryClient();
  const intl = useIntl();

  const redeemItem = useQuery(
    ["redeem", code],
    () => {
      return fetch(`${process.env.GATSBY_API_URL}/user/redeem`, {
        method: "POST",
        headers: {
          Authorization: JwtAuth.getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          redemption_code: code,
        }),
      }).then(async (res) => {
        if (res.status === 204) {
          throw Error("Invalid redemption code");
        }
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        } else {
          return data;
        }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("auth");
      },
      enabled: false,
    }
  );

  return (
    <div className="grid gap-10 lg:gap-20 lg:grid-cols-[57fr,64fr] ">
      <div>
        {edition && (
          <div className="max-w-lg px-4 py-6 mx-auto prose bg-primary-dark md:px-10 xl:px-16 md:py-16">
            <h1 className="mb-3 text-3xl">{edition?.edition_name}</h1>
            <DescriptionCollapse description={edition?.description} />
            {data.status === "error" && (
              <div className="prose">
                <p className="text-red">{data.message}</p>
                <p>
                  <Link to="/marketplace/redeem" className="button">
                    <FormattedMessage id="redeem.enter_another_code" />
                  </Link>
                </p>
              </div>
            )}
            {data.status == "success" && (
              <>
                {redeemItem.data ? (
                  <RedeemItemStates data={redeemItem.data} />
                ) : (
                  <>
                    {user && (
                      <>
                        <div className="prose">
                          <p>
                            <button
                              className="space-x-2"
                              onClick={() => {
                                redeemItem.refetch();
                              }}
                            >
                              <span>
                                {" "}
                                <FormattedMessage id="redeem.add_to_my_collection" />
                              </span>{" "}
                              <LoadingIndicator
                                isLoading={redeemItem.isLoading}
                              />
                            </button>
                          </p>
                        </div>
                      </>
                    )}
                    {!user && (
                      <>
                        <h5 className="!text-green">
                          <FormattedMessage id="redeem.account_needed_message" />
                        </h5>
                        <SignUpForm
                          loginRedirect={`/marketplace/login?redirect=/marketplace/redeem?rc=${code}`}
                          redemption_code={code}
                          isRedemption
                          buttonLabel={intl.formatMessage({
                            id: "redeem.create_account",
                          })}
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {edition && (
        <div className="max-w-lg mx-auto tablet:order-first">
          <div>
            <CardImage data={edition} />
          </div>
        </div>
      )}
    </div>
  );
}

function RedeemItemStates({ data }) {
  switch (data.status) {
    case "error":
      return (
        <div className="prose">
          <p className="text-red">{data.message}</p>
          <p>
            <Link to="/marketplace/redeem" className="button">
              <FormattedMessage id="redeem.enter_code_again" />
            </Link>
          </p>
        </div>
      );

    default:
      return (
        <div className="prose">
          <p className="!text-lg text-green">{data.message}</p>
          <p>
            <FormattedMessage id="redeem.item_in_collection_message" />
          </p>
          <p>
            <Link className="button" to="/marketplace/profile/items">
              <FormattedMessage id="redeem.my_items" />
            </Link>
          </p>
        </div>
      );
  }
}
