/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "gatsby";

const InstallMetamask = ({ open, onClose }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={onClose}
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
                    METAMASK IS NOT INSTALLED
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="leading-6 opacity-80">
                      You'll need to install Metamask to pay with ETH. Visit a
                      wallet provider website like MetaMask.io to get started.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 mt-5">
                <div className="flex justify-center">
                  <button
                    role="button"
                    className="inline-block w-56 py-2 text-center border border-white md:order-first strip-button-styles opacity-70 hover:opacity-100"
                    onClick={() => onClose(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs tracking-wide text-red">
                    Beware of fake websites and scams and be extremely careful
                    about installing any software onto your computer, phone, or
                    browser.
                  </p>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InstallMetamask;
