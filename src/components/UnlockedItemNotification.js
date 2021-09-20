/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import useCookies from "@api/useCookies";
import Countdown from "./Countdown";
import useAuth from "@api/useAuth";
import { useEdition } from "@api/useItems";
import { usePurchases } from "@api/useProfile";
export default function UnlockedItemNotification() {
  const { setCookie, getCookie } = useCookies();
  const { data: eligibility } = usePurchases((data) =>
    data?.eligibility?.find((item) => item.status == "elegible")
  );

  const { data: item } = useEdition(eligibility?.edition_id);
  const { pathname } = useLocation();
  const cancelButtonRef = useRef(null);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (!item) {
      return;
    }
    const cookie = getCookie(`item-unlock-${item.edition_id}`);
    if (pathname.startsWith(item.slug.slice(0, item.slug.length))) {
      return;
    }
    if (!cookie) {
      setOpen(true);
    }
  }, [item?.edition_id]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={() => {
          setOpen(false);
          setCookie(`item-unlock-${item.edition_id}`, true, {
            path: "/",
            secure: true,
          });
        }}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-opacity-75 bg-dark" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform shadow-xl bg-dark sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ring ring-yellow">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="flex justify-center">
                    <Trophy />
                  </div>

                  <div className="mt-8 space-y-2 prose-lg ">
                    <h2 className=" !text-yellow">Congratulations!</h2>
                    <p>
                      <Link className="text-yellow" to={item?.slug}>
                        {item?.edition_name}
                      </Link>{" "}
                      has been unlocked for you to buy.
                    </p>
                    <p>
                      You have{" "}
                      <Countdown date={eligibility?.expiration || Date.now()}>
                        {(time, ended) => (
                          <>
                            {" "}
                            <span className="px-2 text-yellow">
                              {time}
                            </span>{" "}
                          </>
                        )}
                      </Countdown>{" "}
                      to buy the item.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 mt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Link
                    to={item?.slug}
                    role="button"
                    onClick={() => {
                      setCookie(`item-unlock-${item.edition_id}`, true, {
                        path: "/",
                        secure: true,
                      });
                    }}
                    className="flex-grow py-2 font-semibold text-center strip-button-styles bg-yellow text-dark"
                  >
                    See item details
                  </Link>

                  <button
                    role="button"
                    className="flex-grow block py-2 text-center underline md:order-first strip-button-styles opacity-80 hover:opacity-100"
                    ref={cancelButtonRef}
                    onClick={() => {
                      setCookie(`item-unlock-${item.edition_id}`, true, {
                        path: "/",
                        secure: true,
                      });
                      setOpen(false);
                    }}
                  >
                    I don't want it
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function SubtleBonusNotification({ editionId, inline }) {
  const { data: eligibility } = usePurchases((data) =>
    data?.eligibility?.find((item) => item.status == "elegible")
  );
  const { data: item } = useEdition(eligibility?.edition_id);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (!item) {
      return;
    }
    if (pathname.startsWith(item.slug.slice(0, -2)) && inline) {
      setOpen(true);
    }
    if (!pathname.startsWith(item.slug.slice(0, -2)) && !inline) {
      setOpen(true);
    }
  }, [item?.edition_id]);
  return !open ? null : (
    <>
      {" "}
      <Link
        to={item?.slug}
        className="inline-block px-2 bg-yellow/10 text-yellow phone:bg-yellow phone:text-dark phone:block"
      >
        <strong className="pr-2 font-semibold">ACT NOW!</strong> You have{" "}
        <Countdown date={eligibility?.expiration || Date.now()}>
          {(time) => (
            <>
              {" "}
              <span>{time}</span>{" "}
            </>
          )}
        </Countdown>{" "}
        to buy the item.
      </Link>
    </>
  );
}
function Trophy() {
  return (
    <svg
      className="w-32"
      viewBox="0 0 18 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.24584 8.28707C4.12861 8.28707 4.01078 8.25332 3.90653 8.18286C1.83526 6.78067 0.419443 4.52628 0.0221258 2.06893C-0.059569 1.56324 0.0872472 1.04514 0.424779 0.648385C0.775327 0.236272 1.28635 0 1.82636 0H4.14931C4.48446 0 4.75566 0.271198 4.75566 0.606345C4.75566 0.941491 4.48446 1.21269 4.14931 1.21269H1.82636C1.6422 1.21269 1.46814 1.29321 1.34852 1.43417C1.28518 1.50818 1.18509 1.66393 1.21945 1.8753C1.56349 4.00462 2.79098 5.96295 4.58632 7.17859C4.86342 7.36632 4.93627 7.74351 4.74858 8.02061C4.63131 8.19349 4.44003 8.28707 4.24584 8.28707Z"
        fill="#FEA832"
      />
      <path
        d="M13.7544 8.28707C13.5602 8.28707 13.369 8.1941 13.2517 8.02061C13.064 7.74351 13.1368 7.36628 13.4139 7.17859C15.2093 5.96295 16.4368 4.00458 16.7808 1.87587C16.8152 1.66389 16.7151 1.50814 16.6517 1.43413C16.5321 1.29321 16.358 1.21269 16.1739 1.21269H13.851C13.5158 1.21269 13.2446 0.941491 13.2446 0.606345C13.2446 0.271198 13.5158 0 13.851 0H16.1739C16.7139 0 17.2249 0.236272 17.5755 0.648385C17.913 1.0451 18.0598 1.56324 17.9781 2.06949C17.5808 4.52624 16.165 6.78067 14.0937 8.18282C13.9895 8.25332 13.8711 8.28707 13.7544 8.28707Z"
        fill="#FE9923"
      />
      <path
        d="M10.8187 10.9546H7.18066V15.8053H10.8187V10.9546Z"
        fill="#FEA832"
      />
      <path d="M10.819 10.9546H9V15.8053H10.819V10.9546Z" fill="#FE9923" />
      <path
        d="M14.4323 19.9448L13.2196 15.0536C13.159 14.7868 12.9165 14.5928 12.6376 14.5928H5.36145C5.08257 14.5928 4.83999 14.7868 4.7794 15.0536L3.56671 19.9448C3.51816 20.1266 3.55458 20.3207 3.67581 20.4662C3.78499 20.6118 3.96685 20.6966 4.14876 20.6966H13.8503C14.0322 20.6966 14.2141 20.6118 14.3232 20.4662C14.4445 20.3207 14.4809 20.1266 14.4323 19.9448Z"
        fill="#FEDB41"
      />
      <path
        d="M14.3237 20.4662C14.2145 20.6118 14.0327 20.6966 13.8508 20.6966H9V14.5928H12.6381C12.9169 14.5928 13.1595 14.7868 13.2201 15.0536L14.4328 19.9448C14.4814 20.1266 14.445 20.3207 14.3237 20.4662Z"
        fill="#FCBF29"
      />
      <path
        d="M3.54297 0V6.46768C3.54297 9.31745 5.61671 11.8641 8.45436 12.1431C8.6363 12.1552 8.81817 12.1674 9.00007 12.1674C12.0075 12.1674 14.4572 9.71768 14.4572 6.71025V0H3.54297Z"
        fill="#FEDB41"
      />
      <path
        d="M10.8187 17.6244C10.8187 17.9639 10.552 18.2308 10.2124 18.2308H7.78701C7.44742 18.2308 7.18066 17.9639 7.18066 17.6244C7.18066 17.2848 7.44742 17.0181 7.78701 17.0181H10.2124C10.552 17.0181 10.8187 17.2848 10.8187 17.6244Z"
        fill="#FEA832"
      />
      <path
        d="M10.819 17.6244C10.819 17.9639 10.5523 18.2308 10.2127 18.2308H9V17.0181H10.2127C10.5523 17.0181 10.819 17.2848 10.819 17.6244Z"
        fill="#FE9923"
      />
      <path
        d="M12.0067 4.60015C11.934 4.38179 11.74 4.22422 11.5096 4.1878L10.1635 3.99381L9.5692 2.78112C9.46014 2.5628 9.22973 2.46582 8.99932 2.46582C8.7932 2.47795 8.58696 2.58705 8.47786 2.78112L7.87152 3.99381L6.52543 4.1878C6.29502 4.22422 6.11308 4.38179 6.04031 4.60015C5.96755 4.83056 6.02819 5.06098 6.18584 5.23071L7.16812 6.17665L6.9377 7.52273C6.90136 7.74102 6.98625 7.97143 7.18024 8.10478C7.36219 8.25031 7.61681 8.26243 7.81088 8.15333L8.99932 7.53486L9.02361 7.52273L10.2242 8.15337C10.3091 8.20184 10.406 8.22613 10.5031 8.22613C10.6364 8.22613 10.7578 8.18971 10.8669 8.10482C11.0488 7.97143 11.1458 7.74102 11.1094 7.52277L10.879 6.17669L11.8491 5.23075C12.0189 5.06097 12.0675 4.83056 12.0067 4.60015Z"
        fill="#FEA832"
      />
      <path
        d="M14.4571 0V6.71021C14.4571 9.71764 12.0074 12.1673 9 12.1673V0H14.4571Z"
        fill="#FCBF29"
      />
      <path
        d="M11.8498 5.23071L10.8796 6.17665L11.11 7.52273C11.1465 7.74102 11.0494 7.97143 10.8675 8.10478C10.7584 8.18967 10.6371 8.22609 10.5037 8.22609C10.4066 8.22609 10.3097 8.2018 10.2248 8.15333L9.02425 7.52269L9 7.53486V2.46582C9.23041 2.46582 9.46082 2.5628 9.56992 2.78112L10.1642 3.99381L11.5103 4.1878C11.7407 4.22422 11.9347 4.38179 12.0075 4.60015C12.0681 4.83056 12.0196 5.06098 11.8498 5.23071Z"
        fill="#FE9923"
      />
    </svg>
  );
}
