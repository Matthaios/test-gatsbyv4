import useAuth from "@api/useAuth";
import { usePurchases } from "@api/useProfile";
import ConnectWalletButton from "@components/ConnectWalletButton";
import InstallMetamask from "@components/InstallMetamask";
import Layout from "@components/Layout";
import LoadingIndicator from "@components/LoadingIndicator";
import Divider from "@components/Divider";
import ProtectedComponent from "@components/ProtectedComponent";
import { css } from "@emotion/react";
import { getChainData } from "@helpers/utilities";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import Hero from "@images/hero-char.png";
import { NameRegex } from "@utils/regex";
import useWeb3Modal from "@utils/web3modal";
import { Link } from "gatsby";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import tw from "twin.macro";
import * as yup from "yup";
import { isMetamaskInstalled } from "@api/useWeb3";

const schema = yup.object().shape({
  first_name: yup
    .string()
    .min(0)
    .matches(NameRegex, "Please enter valid first name")
    .max(50),
  last_name: yup
    .string()
    .min(0)
    .matches(NameRegex, "Please enter valid last name")
    .max(50),
  bio: yup.string().min(0).max(4000),
});
function Profile() {
  const { onConnect, conState, query } = useWeb3Modal();
  console.log("query", query);

  const [metamaksInstallModal, setMetamaskInstallModal] = useState(false);
  const purchases = usePurchases();
  const isWalletConnected = useMemo(() => {
    if (typeof window == "undefined") {
      return false;
    }

    const connected = conState.connected;
    const chainId = conState.chainId;

    const chainData = chainId ? getChainData(chainId) : null;

    return connected && chainData;
  }, [conState.connected, conState.chainId]);

  const { user, updateUser } = useAuth();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: user
      ? {
          first_name: user.first_name,
          last_name: user.last_name,
          bio: user.bio ?? "",
        }
      : {
          first_name: "",
          last_name: "",
          bio: "",
        },
  });

  const formSubmit = handleSubmit(async (data) => {
    await updateUser.mutateAsync(data);
  });
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        bio: user.bio ?? "",
      });
    }
  }, [user?.id]);

  return (
    <Layout>
      <ProtectedComponent redirect="/marketplace/profile">
        <div>
          <div className="hero-spacer"></div>
          <div className="container py-16">
            <div
              className="grid lg:gap-x-20 "
              css={css`
                .bg {
                  background: rgba(42, 8, 90, 0.4);
                }
                .text-yellow {
                  color: var(--yellow);
                }
                .accented {
                  font-size: 25px;
                  @media (min-width: 1280px) {
                    font-size: 32px;
                  }
                  font-weight: 800;
                  color: var(--primary-light);
                  margin-right: 12px;
                  display: inline-block;
                }
                .label {
                  font-size: 18px;
                  @media (min-width: 1280px) {
                    font-size: 20px;
                  }
                }
                .bg-yellow {
                  background-color: var(--yellow);
                  color: #080112;
                }
                .text-primary-light {
                  color: #ceb9eb;
                }
                @media (min-width: 1024px) {
                  grid-template-columns: 1fr 2fr;
                }
              `}
            >
              <div>
                <div className="bg">
                  <div className="px-10 py-16">
                    <img src={Hero} className="mx-auto"></img>
                  </div>
                  {!isWalletConnected && (
                    <div className="p-10 text-center bg">
                      <ConnectWalletButton
                        onClick={() => {
                          if (!isMetamaskInstalled) {
                            setMetamaskInstallModal(true);
                            return;
                          }
                          onConnect();
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="tablet:order-first">
                <div
                  className="grid gap-y-4 gap-x-8"
                  css={css`
                    grid-template-columns: repeat(2, 1fr);
                    @media (min-width: 768px) {
                      grid-template-columns: repeat(2, max-content);
                    }
                    @media (min-width: 1420px) {
                      grid-template-columns: minmax(max-content, 1fr) auto auto;
                    }
                  `}
                >
                  <h2 className="col-span-2 text-4xl font-semibold name xxl:col-span-1">
                    {user?.first_name ? `Hello ${user?.first_name},` : "Hello,"}{" "}
                  </h2>
                </div>
                <Link
                  to="/marketplace/profile/items"
                  className="flex justify-between py-10 my-8 divide-x phone:py-6 bg-primary-dark hover:bg-primary hover:bg-opacity-40 divider-white divide-opacity-25"
                  css={css`
                    > div {
                      ${tw`px-6 md:px-10 xl:px-12`}
                    }
                  `}
                >
                  <div className="flex flex-wrap flex-grow text-xl">
                    <div>
                      <span className="accented">
                        <LoadingIndicator isLoading={purchases.isLoading} />
                        {purchases?.purchases?.length}
                      </span>{" "}
                      <span className="label">
                        {purchases?.purchases?.length === 1 ? "Item" : "Items"}
                      </span>
                      <span className="pl-4 text-sm italic opacity-50">
                        - See Details
                      </span>
                    </div>
                  </div>
                </Link>

                <Divider />
                <div className="my-10">
                  <h2 className="mb-8 text-xl font-semibold ">
                    Your Information
                  </h2>
                  <form
                    onSubmit={formSubmit}
                    css={css`
                      input,
                      textarea {
                        ${tw`block w-full`}
                      }
                    `}
                    className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 form-inverse"
                  >
                    <div className="px-4 py-2 prose bg-primary-dark md:col-span-2 max-w-none">
                      <strong>Email:</strong> {user?.email}
                    </div>
                    <div>
                      <input
                        maxLength="50"
                        {...register("first_name")}
                        type="text"
                        placeholder="First Name"
                      />
                      <ErrorMessage
                        errors={formState.errors}
                        name="first_name"
                        render={({ message }) => (
                          <div className="text-sm text-red">{message}</div>
                        )}
                      />
                    </div>
                    <div>
                      <input
                        maxLength="50"
                        {...register("last_name")}
                        type="text"
                        placeholder="Last Name"
                      />
                      <ErrorMessage
                        errors={formState.errors}
                        name="last_name"
                        render={({ message }) => (
                          <div className="text-sm text-red">{message}</div>
                        )}
                      />
                    </div>
                    <div className=" md:col-span-2">
                      <textarea
                        maxLength="4000"
                        {...register("bio")}
                        placeholder="Bio"
                      />
                      <ErrorMessage
                        errors={formState.errors}
                        name="bio"
                        render={({ message }) => (
                          <div className="text-sm text-red">{message}</div>
                        )}
                      />
                    </div>

                    <div className="py-1 text-center md:col-span-2">
                      <button
                        className="space-x-2 button"
                        type="submit"
                        disabled={formState.isSubmitting}
                      >
                        {" "}
                        <span> Save information</span>
                        <LoadingIndicator isLoading={updateUser.isLoading} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedComponent>
      <InstallMetamask
        open={metamaksInstallModal}
        onClose={() => setMetamaskInstallModal(false)}
      />
    </Layout>
  );
}

export default function ProfilePage() {
  return <Profile />;
}
