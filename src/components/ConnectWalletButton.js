import React from "react";

import { FaLink } from "react-icons/fa";

const ConnectWalletButton = ({
  style,
  className,
  children = "",
  onClick = () => {},
}) => {

  return (
    <button className={className} style={style} onClick={(e) => onClick()}>
      {children === "" ? (
        <>
          <FaLink className="inline-block mr-2 h-3" />
          Link your Metamask wallet
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ConnectWalletButton;
