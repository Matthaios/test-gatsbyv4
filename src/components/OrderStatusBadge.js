import React from "react";
import cn from "classnames";
import { IoMdInformationCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { MdError } from "react-icons/md";

export default function OrderStatusBadge({ order = { status: null } }) {
  return (
    <strong
      className={cn("inline-flex items-center px-2 rounded-sm capitalize", {
        "bg-green bg-opacity-20 text-green ": order.status === "purchased",
        "bg-yellow bg-opacity-20 text-yellow ": order.status == "pending",
        "bg-red bg-opacity-20 text-red ": order.status == "canceled",
      })}
    >
      {order?.status == "purchased" && (
        <IoMdInformationCircle className="inline-block mr-2" />
      )}
      {order?.status == "pending" && (
        <FaSpinner className="inline-block mr-2 animate-spin" />
      )}
      {order?.status == "canceled" && (
        <MdError className="inline-block mr-2 " />
      )}
      {order?.status}
    </strong>
  );
}
