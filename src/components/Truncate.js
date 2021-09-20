import React, { useState } from "react";
import { Popover } from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { motion } from "framer-motion";

export default function Truncate({ text, min, length = 12, className }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <Popover
      as={motion.span}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className="relative !px-0"
    >
      {({ open }) => {
        return (
          <>
            {" "}
            <Popover.Button
              className={`strip-button-styles inline-flex items-center   cursor-help ${className}`}
            >
              {String(text)?.slice?.(0, length)}
              <BsThreeDots className="mx-1 opacity-50" />
            </Popover.Button>
            {(open || isHover) && (
              <Popover.Panel
                className="absolute z-10 px-3 py-1 bg-white rounded-sm shadow-sm font-semibold text-sm !text-dark"
                static
              >
                {text}
              </Popover.Panel>
            )}
          </>
        );
      }}
    </Popover>
  );
}
