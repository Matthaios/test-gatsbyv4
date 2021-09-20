import { useFacebookLogin, useGoogleLogin, useAppleLogin } from "@api/useAuth";
import { css } from "@emotion/react";
import React, { useEffect } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import AppleLogin from "react-apple-login";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { useLocation } from "@reach/router";
import { parse } from "query-string";
import useNotifications from "@utils/notifications";
import { FormattedMessage } from "react-intl";
import LoadingIndicator from "@components/LoadingIndicator";

export default function SocialLogin({ redirect, type = "login" }) {
  return (
    <div>
      <div className="flex items-center justify-center mt-8 opacity-50 flex-nowrap">
        <div className="relative flex justify-center">
          <span className="px-4 text-lg font-medium text-white ">
            {" "}
            {type == "login" ? (
              <FormattedMessage id="user.sign_in" />
            ) : (
              <FormattedMessage id="user.sign_up" />
            )}{" "}
            with
          </span>
        </div>
      </div>
      <div
        className="mt-4 space-y-4"
        css={css`
          > div {
            text-align: center;
          }
        `}
      >
        <div>
          <Facebook type={type} redirect={redirect} />
        </div>{" "}
        <div>
          <Google type={type} redirect={redirect} />
        </div>
        <div>
          <Apple type={type} redirect={redirect} />
        </div>
      </div>
    </div>
  );
}

function Facebook({ redirect }) {
  const login = useFacebookLogin(redirect);

  const responseFacebook = (response) => {
    login.mutate({
      access_token: response.accessToken,
      fb_user_id: response.userID,
      first_name: response.name,
    });
  };
  return (
    <>
      {" "}
      <FacebookLogin
        appId={process.env.GATSBY_FB_APP_ID}
        disableMobileRedirect={true}
        render={(renderProps) => (
          <button
            className="flex items-center focus:outline-none space-x-2 !bg-[#4267B2]"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <LoadingIndicator isLoading={login.isLoading} />
            {!login.isLoading && (
              <>
                {" "}
                <FaFacebook />
                <div className="text-center"> Facebook </div>
              </>
            )}
          </button>
        )}
        autoLoad={false}
        fields="name,email"
        callback={responseFacebook}
      />
      {login.isError && (
        <div className="mt-1 font-semibold text-red">{login.error}</div>
      )}
    </>
  );
}

function Google({ redirect }) {
  const login = useGoogleLogin(redirect);
  const notification = useNotifications();

  const onSuccess = (response) => {
    login.mutate({ id_token: response.tokenId });
  };
  function onFailure(response) {
    notification.error({ text: "Google Auth: " + response?.details });
  }
  return (
    <>
      {" "}
      <GoogleLogin
        disableMobileRedirect={true}
        className="flex flex-col items-center strip-button-styles"
        clientId={process.env.GATSBY_GOOGLE_CLIENT_ID}
        render={(renderProps) => (
          <button
            className="flex items-center focus:outline-none space-x-2 !bg-[#de5246]"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <LoadingIndicator isLoading={login.isLoading} />
            {!login.isLoading && (
              <>
                {" "}
                <FaGoogle />
                <div className="text-center"> Google </div>
              </>
            )}
          </button>
        )}
        buttonText="Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />{" "}
      {login.isError && (
        <div className="mt-1 font-semibold text-red">{login.error}</div>
      )}
    </>
  );
}

function Apple({ redirect }) {
  const login = useAppleLogin(redirect);
  const notification = useNotifications();
  const location = useLocation();
  const { id_token, first_name, last_name } = parse(location.search);
  useEffect(() => {
    id_token &&
      login.mutate({
        id_token,
        first_name,
        last_name,
      });
    return () => {};
  }, []);

  return (
    <>
      <AppleLogin
        scope="name email"
        responseMode="form_post"
        responseType="code id_token"
        clientId={process.env.GATSBY_APPLE_CLIENT_ID}
        redirectURI={
          process.env.GATSBY_WEBSITE_URL + "/.netlify/functions/apple-login"
        }
        render={(renderProps) => (
          <button
            className="flex items-center focus:outline-none space-x-2 !bg-[#000000]"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <LoadingIndicator isLoading={login.isLoading} />
            {!login.isLoading && (
              <>
                {" "}
                <FaApple />
                <div className="text-center"> Apple </div>
              </>
            )}
          </button>
        )}
        callback={(res) => {
          if (res.error) {
            notification.error({ text: "Apple Auth: " + res.error?.error });
          } else {
            login.mutate({
              id_token: res?.authorization?.id_token,
              firstName: res?.user?.name?.firstName,
              lastName: res?.user?.name?.lastName,
            });
          }
        }}
      />{" "}
      {login.isError && (
        <div className="mt-1 font-semibold text-red">{login.error}</div>
      )}
    </>
  );
}
