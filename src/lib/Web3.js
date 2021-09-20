import React from "react";
import Helmet from "react-helmet";

export default function Web3() {
  return (
    <>
      <Helmet>
        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.3.5/web3.min.js"
        />
      </Helmet>
    </>
  );
}
