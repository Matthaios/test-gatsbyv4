import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import Portal from "@reach/portal";
import { Dialog } from "@headlessui/react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import screenfull from "screenfull";
const duration = 0.3;
const backdropVariants = {
  open: {
    pointerEvents: "auto",
    transition: {
      duration,
      ease: "easeOut",
    },
  },
  hide: {
    pointerEvents: "none",
    transition: {
      duration,
      ease: "easeIn",
    },
  },
};
const modalVariants = {
  open: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: {
      duration,
      ease: "easeOut",
    },
  },
  hide: {
    opacity: 0,
    y: 50,
    pointerEvents: "none",
    transition: {
      duration,
      ease: "easeIn",
    },
  },
};

export default function MediaModal({ isOpen, setIsOpen, children }) {
  const [isInFullscreen, setIsInFullscreen] = useState(false);
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        setIsInFullscreen(screenfull.isFullscreen);
      });
    }
  }, []);
  return (
    <Portal>
      {isOpen && (
        <Dialog
          static
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          open={true}
          onClose={() => setIsOpen(false)}
        >
          <Dialog.Overlay
            as={motion.div}
            key={"backdrop"}
            initial={"hide"}
            animate={isOpen ? "open" : "hide"}
            variants={backdropVariants}
            className="absolute z-0 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-sm bg-dark"
          />

          <motion.div
            key={"modal"}
            initial={"hide"}
            animate={isOpen ? "open" : "hide"}
            exit={"hide"}
            variants={modalVariants}
            className={
              "bg-black  p-8 relative z-10 w-screen h-screen  max-h-screen phone:overflow-y-auto   "
            }
            css={css`
              box-shadow: 0px 0px 124px rgba(255, 255, 255, 0.1);
            `}
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              href="#"
              className="absolute z-50 inline-flex bg-transparent top-8 right-8"
            >
              {!isInFullscreen && <MdClose className="text-2xl" />}
            </a>
            {children}
          </motion.div>
        </Dialog>
      )}
    </Portal>
  );
}
