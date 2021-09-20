import React from "react"

export default function Divider({ ...rest }) {
  return (
    <div
      style={{ borderBottom: "1px solid rgba(255,255,255,.1)" }}
      {...rest}
    ></div>
  )
}
