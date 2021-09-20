/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import useCookies from "@api/useCookies";
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const { setCookie, getCookie } = useCookies();
  const { pathname } = useLocation();
  const cancelButtonRef = useRef(null);
  React.useEffect(() => {
    if (typeof window == "undefined") {
      return;
    }
    if (pathname !== "/privacy-policy") {
      const cookie = getCookie("consent");

      if (!cookie) {
        setOpen(true);
      }
    }
  }, []);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
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
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform shadow-xl bg-dark sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ring ring-primary">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="mb-4 text-3xl font-medium leading-6 "
                  >
                    WE USE COOKIES
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="leading-6 opacity-80">
                      This website uses essential cookies to ensure its proper
                      operation. To get more information about these cookies,
                      select the ‘Find Out More’ button below.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 mt-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    role="button"
                    className="flex-grow py-2 text-center strip-button-styles bg-primary"
                    ref={cancelButtonRef}
                    onClick={() => {
                      setCookie("consent", true, {
                        path: "/",
                        secure: true,
                        maxAge: 60 * 60 * 24 * 30 * 365,
                      });
                      setOpen(false);
                    }}
                  >
                    Accept All
                  </button>

                  <Link
                    role="button"
                    className="flex-grow block py-2 text-center underline md:order-first strip-button-styles opacity-80 hover:opacity-100"
                    to="/privacy-policy"
                    onClick={() => setOpen(false)}
                  >
                    Find Out More
                  </Link>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
