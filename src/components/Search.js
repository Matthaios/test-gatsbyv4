import React from "react";
import { css } from "@emotion/react";
import tw from "twin.macro";
import { FaSearch } from "react-icons/fa";
import { Link } from "gatsby";
import buttonBg from "@images/redeem-button-bg.png";
import { FormattedMessage, useIntl } from "react-intl";
export default function Search({ setSearch }) {
  const intl = useIntl();
  return (
    <div className="my-20 ">
      <div className="container flex items-center justify-between tablet:flex-col tablet:space-y-5">
        <label
          className="flex items-center w-full max-w-lg cursor-text "
          css={css`
            color: #a29fa6;
            ${tw`border-b border-white border-opacity-20`}
            input {
              background: transparent;
              color: currentColor;
              &::placeholder {
                color: currentColor;
              }
            }
          `}
        >
          <FaSearch />{" "}
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            type="text"
            placeholder={intl.formatMessage({ id: "search" })}
            className="flex-grow text-current bg-transparent"
          />
        </label>
        <div>
          <Link
            style={{ background: `url(${buttonBg}),#512c84` }}
            className="block px-6 py-3 font-semibold bg-no-repeat bg-cover bg-primary"
            to="/marketplace/redeem"
          >
            <FormattedMessage id="redemption_code_button" />
          </Link>
        </div>
      </div>
    </div>
  );
}
