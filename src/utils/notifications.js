import React from "react";
import Portal from "@reach/portal";
import { useQuery, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import { IoMdCheckmarkCircle, IoMdWarning } from "react-icons/io";
import cn from "classnames";
import { MdError } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationsProvider() {
  const query = useQuery("notifications", () => {
    return [];
  });

  return (
    <Portal>
      <AnimatePresence>
        <div className="fixed bottom-8 right-8 space-y-3">
          {query?.data?.map(
            ({ id, type, text, textStyles, containerStyles }) => {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={id}
                  className={cn(
                    " w-64 bg-primary-dark text-white shadow-lg  pointer-events-auto ring-1  overflow-hidden",
                    {
                      " ring-yellow-200 ": type === "warning",
                      " ring-green-300 ": type === "info",
                      " ring-red ": type === "error",
                      containerStyles,
                    }
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {type === "warning" && (
                          <IoMdWarning className={"text-yellow-200"} />
                        )}
                        {type === "info" && (
                          <IoMdCheckmarkCircle className={"text-green-300"} />
                        )}
                        {type === "error" && <MdError className={"text-red"} />}
                      </div>
                      <div className="ml-3 w-0 flex-1 ">
                        <p
                          className={cn(" text-sm text-white", {
                            " text-yellow-200 ": type === "warning",
                            " text-green-300 ": type === "info",
                            " text-red ": type === "error",
                            textStyles,
                          })}
                        >
                          {text}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </AnimatePresence>
    </Portal>
  );
}

export default function useNotification() {
  const client = useQueryClient();
  function push(data, type, delay = 4) {
    const id = data.id ?? uuid();

    client.setQueryData("notifications", (previous) => {
      return [...previous, { ...data, type, id }];
    });

    setTimeout(() => {
      clear(id);
    }, delay * 1000);
  }

  function clear(id) {
    client.setQueryData("notifications", (previous) => {
      return previous.filter((p) => p.id !== id);
    });
  }
  const info = (data, delay = 4) => push(data, "info", delay);
  const error = (data, delay = 4) => push(data, "error", delay);
  const warning = (data, delay = 4) => push(data, "warning", delay);
  const blank = (data, delay = 4) => push(data, "blank", delay);

  return { info, error, warning, blank, clear };
}
