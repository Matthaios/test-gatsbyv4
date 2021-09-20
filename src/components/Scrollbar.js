import React from "react";
import { css } from "@emotion/react";
export default function Scrollbar({ children, className }) {
  return (
    <div
      css={css`
        &::-webkit-scrollbar {
          width: 0.25em;
          height: 0.4em;
          cursor: ew-resize;
        }

        &::-webkit-scrollbar-track {
          /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
          background-color: rgba(255, 255, 255, 0.3);

          /* border: 1px solid #a2b6db; */
        }
        /* light: "#ceb9eb",
          DEFAULT: "#512c84",
          dark: "#150728", */
        &::-webkit-scrollbar-thumb {
          background-color: #512c84;
          /* outline: 1px solid rgba(220, 155, 53, 0.8); */
        }
      `}
      className={"h-full overflow-y-auto " + className}
    >
      {children}
    </div>
  );
}
