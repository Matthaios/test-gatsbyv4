import React from "react";
import cn from "classnames";
import { IoMdInformationCircle } from "react-icons/io";
import { MdError } from "react-icons/md";
import LoadingIndicator from "./LoadingIndicator";

export default function TransferStatusBadge({ status }) {
  return (
    <strong
      className={cn("inline-flex items-center px-2 rounded-sm capitalize", {
        "bg-green bg-opacity-20 text-green ": status === 1,
        "bg-yellow bg-opacity-20 text-yellow ": status === 0,
        "bg-red bg-opacity-20 text-red ": status !== 0 && status !== 1,
      })}
    >
      {status === 1 && <IoMdInformationCircle className="inline-block mr-2" />}
      {status === 0 && (
        <LoadingIndicator isLoading className="inline-block mr-2 text-yellow" />
      )}

      {status === false && <MdError className="inline-block mr-2 " />}
      {status === 1 && "Transfered"}
      {status === 0 && "Pending"}
    </strong>
  );
}
