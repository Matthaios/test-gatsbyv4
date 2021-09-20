import Robot from "@images/robot-icons.svg";
import React from "react";
import { FaSpinner } from "react-icons/fa";
import cn from "classnames";
export default function LoadingIndicator({
  isLoading = false,
  robot = false,
  className,
}) {
  return isLoading ? (
    robot ? (
      <div
        className={cn(
          "container pt-[220px] text-center   h-full     flex items-center justify-center",
          {
            className,
          }
        )}
      >
        <img src={Robot} className="flex-shrink-0 w-32 animate-pulse" />
      </div>
    ) : (
      <FaSpinner className={cn("inline text-white animate-spin ", className)} />
    )
  ) : null;
}
