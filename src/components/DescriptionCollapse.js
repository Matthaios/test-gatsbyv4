import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import Collapse from "./Collapse";

export default function DescriptionCollapse({ description }) {
  const [isOpen, setIsOpen] = useState(false);

  const limit = 400;

  if (description?.length >= limit) {
    return (
      <>
        <Collapse
          isOpen={isOpen}
          variants={{
            open: {
              height: "auto",
            },
            closed: {
              height: 160,
            },
          }}
        >
          <p className="opacity-80">{description}</p>
        </Collapse>
        <div
          className="mt-3 text-sm underline cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <FormattedMessage id="item.show_less" />
          ) : (
            <FormattedMessage id="item.show_more" />
          )}
        </div>
      </>
    );
  } else {
    return <p className="opacity-80">{description}</p>;
  }
}
