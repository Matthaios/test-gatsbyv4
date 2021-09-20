import formatDate from "@utils/formatDate";
import React from "react";

export default function TransferTimeline({ transfer }) {
  const timeline = [
    {
      text: `Transfer initiated on <span class="text-green">${formatDate(
        transfer?.createdAt
      )}</span>`,
    },
    {
      text: `Sender account: <span class="text-green">${transfer.sender}</span>`,
    },
    {
      text: `Transfering item to <span class="text-green"> ${transfer.network}</span> network.`,
    },
  ];

  if (transfer.status == 1) {
    timeline.push({
      text: `Receiver account: <span class="text-green">${transfer.receiver}</span>`,
    });
    timeline.push({
      text: `Transfer successfully finished!`,
    });
  } else {
    timeline.push({
      text: `Pending ...`,
    });
  }

  return (
    <div className="flow-root mt-8">
      <ul role="list" className="-mb-8">
        {timeline.map((line, index) => (
          <li key={line.id}>
            <div className="relative pb-8">
              {index !== timeline.length - 1 ? (
                <span
                  className="absolute top-1.5 left-1.5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3 ">
                <div>
                  <span
                    className={
                      "h-3 w-3 rounded-full flex items-center justify-center  bg-white  "
                    }
                  ></span>
                </div>
                <div className="flex justify-between flex-1 min-w-0 -mt-1 space-x-4">
                  <div>
                    <p
                      className="text-sm text-white"
                      dangerouslySetInnerHTML={{ __html: line.text }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
