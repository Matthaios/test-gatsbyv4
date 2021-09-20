import { useAuctionBids, useModifyAuction } from "@api/useAuction";
import Countdown from "@components/Countdown";
import {
  ErrorMessage,
  Form,
  InputCheckbox,
  InputDate,
  InputPrice,
  SubmitButton,
} from "@components/Form";
import LoadingIndicator from "@components/LoadingIndicator";
import Modal from "@components/Modal";
import { css } from "@emotion/react";
import cn from "classnames";
import React, { useEffect, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useIntl } from "react-intl";
import * as yup from "yup";
const formValidationSchema = (intl, editing) =>
  yup.object().shape({
    silent_auction: yup.boolean(),
    date: yup
      .string()
      .required(intl.formatMessage({ id: "forms.required_field_message" })),
    min_price: yup.lazy((value, schema) => {
      if (schema?.parent?.silent_auction) {
        return yup.mixed().notRequired();
      }
      if (value !== undefined) {
        return yup
          .mixed()
          .test(
            "min",
            "Minimum auction price is $1.",
            (value) => parseFloat(value) >= 1
          );
      } else {
        return yup
          .mixed()
          .required(intl.formatMessage({ id: "forms.required_field_message" }));
      }
    }),
    buy_now_price: yup.string().when("min_price", (min_price, schema) => {
      return schema.test({
        test: (buy_now_price) =>
          !buy_now_price || parseFloat(buy_now_price) >= parseFloat(min_price),
        message: "Buy Now Price must be more than min price.",
      });
    }),

    reserve_price: yup.lazy((value, schema) => {
      if (!value) {
        return yup.mixed().notRequired();
      } else {
        if (schema?.parent?.silent_auction) {
          return yup
            .mixed()
            .test("min", "Minimum reserve price is $1.", (value) => {
              return parseFloat(value) >= 1;
            });
        } else {
          return yup
            .mixed()
            .when("min_price", (min_price, schema) => {
              return schema.test({
                test: (reserve_price) =>
                  parseFloat(reserve_price) >= parseFloat(min_price),
                message: "Reserve price can't be smaller then minimum price!",
              });
            })
            .when("buy_now_price", (buy_now_price, schema) => {
              return schema.test({
                test: (reserve_price) =>
                  !buy_now_price ||
                  parseFloat(reserve_price) <= parseFloat(buy_now_price),
                message: "Reserve price must be smaller then buy price!",
              });
            });
        }
      }
    }),
  });
export default function EditAuction({ auction, textOnly }) {
  const action = useModifyAuction();
  const intl = useIntl();
  const bids = useAuctionBids(auction?.id);
  const schema = formValidationSchema(intl, true);
  const [isOpen, setIsOpen] = useState(false);

  const [hasBuyNowTransaction, setHasBuyNowTransaction] = useState(false);
  useEffect(() => {
    console.log("bids check");
    setHasBuyNowTransaction(Boolean(bids.data?.find((b) => b.buy_now_bid)));
  }, [bids]);
  if (!auction || auction?.completed) {
    return null;
  }
  return (
    <>
      <Countdown date={auction?.end_at}>
        {(time, ended, locked) => {
          const lock = hasBuyNowTransaction || locked;
          return (
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              title={
                locked
                  ? "Last 5 minutes auction is locked and you can't change it."
                  : hasBuyNowTransaction
                  ? "Can't edit auction while user can buy the item!"
                  : ""
              }
              disabled={lock}
              className={cn(
                "inline-flex items-center space-x-2 disabled:opacity-50",
                {
                  "strip-button-styles underline ": textOnly,
                  "!bg-transparent hover:!bg-white/10 border border-white disabled:border-opacity-50":
                    !textOnly,
                }
              )}
            >
              {lock && <AiOutlineLock />} <span>Edit auction</span>
            </button>
          );
        }}
      </Countdown>
      <Modal disableClose {...{ isOpen, setIsOpen }}>
        <Form
          schema={schema}
          defaultValues={{
            date: new Date(auction.end_at),
            min_price: auction.min_price,
            silent_auction: auction.silent_auction,
            buy_now_price: auction.silent_auction
              ? undefined
              : parseFloat(auction.buy_now_price)
              ? auction.buy_now_price
              : undefined,
            reserve_price:
              parseFloat(auction.reserve_price) === 0 || !auction.reserve_price
                ? undefined
                : auction.reserve_price,
          }}
          onSubmit={async (values) => {
            const end_at = new Date(values.date).toUTCString();

            action
              .mutateAsync({
                id: auction.id,
                silent_auction: auction.silent_auction,
                min_price: auction?.silent_auction
                  ? auction.min_price
                  : parseFloat(values.min_price),
                reserve_price: parseFloat(values.reserve_price),
                buy_now_price: auction?.silent_auction
                  ? auction.buy_now_price
                  : parseFloat(values.buy_now_price),
                end_at,
              })
              .then(() => {
                setIsOpen(false);
              });
          }}
        >
          {(form) => {
            const values = form.watch();
            return (
              <>
                <h1>{auction.title}</h1>
                <div
                  className="grid gap-6 md:grid-cols-2 auto-rows-[minmax(50px,auto)]"
                  css={css`
                    .edit-label {
                      font-size: 13px;
                      font-weight: 700;
                      opacity: 0.8;
                      letter-spacing: 0.02em;
                    }
                  `}
                >
                  <InputCheckbox
                    name="silent_auction"
                    hidden
                    value={values.silent_auction}
                  />
                  <div className={cn({ hidden: values.silent_auction })}>
                    <div className="edit-label"> Minimum Bid* </div>
                    <div className="flex items-center px-4 bg-white h-[50px]">
                      <span className="text-2xl font-semibold text-primary">
                        $
                      </span>{" "}
                      <InputPrice
                        name="min_price"
                        placeholder={"Minimum Bid*"}
                      />
                    </div>
                    <div className="mt-1">
                      <ErrorMessage name="min_price" />
                    </div>
                  </div>
                  <div>
                    <div className="edit-label">Reserve Price (optional)</div>
                    <div className="flex items-center px-4 bg-white h-[50px]">
                      <span className="text-2xl font-semibold text-primary">
                        $
                      </span>{" "}
                      <InputPrice
                        name="reserve_price"
                        placeholder={"Reserve Price (optional)"}
                      />
                    </div>
                    <div className="mt-1">
                      <ErrorMessage name="reserve_price" />
                    </div>
                  </div>
                  <div className={cn({ hidden: values.silent_auction })}>
                    <div className="edit-label">
                      Buy it Now Price (optional)
                    </div>
                    <div className="flex items-center px-4 bg-white h-[50px]">
                      <span className="text-2xl font-semibold text-primary">
                        $
                      </span>{" "}
                      <InputPrice
                        name="buy_now_price"
                        placeholder={"Buy it Now Price (optional)"}
                      />
                    </div>
                    <div className="mt-1">
                      <ErrorMessage name="buy_now_price" />
                    </div>
                  </div>

                  <div>
                    <div className="edit-label">Auction Expiration*</div>
                    <div className="flex items-center px-4 bg-white h-[50px]">
                      <span className="text-xl font-semibold text-primary">
                        <FaRegCalendarAlt />
                      </span>{" "}
                      <InputDate
                        showTimeSelect={true}
                        name="date"
                        type="date"
                        placeholder="Auction Expiration*"
                      />
                    </div>
                    <div className="mt-1">
                      <ErrorMessage name="date" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <SubmitButton
                    className="space-x-2"
                    disabled={action.isLoading}
                  >
                    <span>Done</span>{" "}
                    <LoadingIndicator isLoading={action.isLoading} />
                  </SubmitButton>
                </div>
                {action.isError && (
                  <div className="mt-3 font-semibold text-center text-red">
                    {action?.error?.message ?? action?.error}
                  </div>
                )}
              </>
            );
          }}
        </Form>
      </Modal>
    </>
  );
}
