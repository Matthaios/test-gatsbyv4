import { useOrders } from "@api/useOrders";
import LoadingIndicator from "@components/LoadingIndicator";
import OrderStatusBadge from "@components/OrderStatusBadge";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import { css } from "@emotion/react";
import formatDate from "@utils/formatDate";
import formatMintNumber from "@utils/formatMintNumber";
import formatPrice from "@utils/formatPrice";
import { Link } from "gatsby";
import React from "react";
import { FormattedMessage } from "react-intl";
import tw from "twin.macro";
export default function Orders() {
  const orders = useOrders();
  return (
    <ProfileSubPagesLayout>
      <LoadingIndicator robot isLoading={orders.isLoading} />
      <div
        className="mb-12 "
        css={css`
          .grid-template {
            ${tw`grid`}
            grid-template-columns: repeat(2, 1fr);
            grid-template-areas: "name name" "price date" "platform status";
            .name {
              grid-area: name;
            }
            .price {
              grid-area: price;
            }
            .date {
              grid-area: date;
            }
            .platform {
              grid-area: platform;
            }
            .status {
              grid-area: status;
            }

            @media (min-width: 768px) {
              grid-template-columns: repeat(3, 1fr);
              grid-template-areas: "name name price" "date platform status";
            }
            @media (min-width: 1024px) {
              grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
              grid-template-areas: "date name price platform status";
            }

            span {
              ${tw`p-4 tablet:py-1`}
            }
          }
        `}
      >
        {orders?.data?.length === 0 && <p>You haven’t bought anything yet.</p>}
        {orders?.data?.length > 0 && (
          <div className="grid-template bg-primary-dark  tablet:!hidden">
            <span>
              <FormattedMessage id="date" />
            </span>
            <span>
              <FormattedMessage id="cart.items" /> (
              <FormattedMessage id="orders.mint" />)
            </span>
            <span>
              <FormattedMessage id="cart.price" />
            </span>
            <span>
              <FormattedMessage id="orders.platform" />
            </span>
            <span>
              <FormattedMessage id="orders.status" />
            </span>
          </div>
        )}

        {orders?.data?.map((item) => {
          return (
            <Link
              to={`/marketplace/profile/orders/${item.id}`}
              key={item.id}
              className="py-2 border-t border-white grid-template border-opacity-20 hover:bg-primary hover:bg-opacity-20"
            >
              <span className="date">
                <div className="text-xs font-bold lg:hidden opacity-60">
                  <FormattedMessage id="date" />
                </div>
                {formatDate(item.purchase_date)}
              </span>
              <span>
                <div className="text-xs font-bold lg:hidden opacity-60">
                  <FormattedMessage id="name" />
                </div>
                {item.items.map((i) => (
                  <strong className="block font-semibold">
                    {i.edition_name}{" "}
                    <span className="opacity-80">
                      ({formatMintNumber(i.item_id)})
                    </span>
                  </strong>
                ))}
              </span>
              <span className="font-bold price tablet:text-green">
                <div className="text-xs font-bold lg:hidden opacity-60">
                  Price
                </div>

                {item.platform === "metamask"
                  ? item.items
                      .reduce((total, item) => {
                        return total + parseFloat(item.eth_amount);
                      }, 0)
                      .toFixed(5) + "ETH"
                  : formatPrice(
                      item.items.reduce((total, item) => {
                        return total + parseFloat(item.amount);
                      }, 0)
                    )}
              </span>
              <span className="capitalize platform">
                {" "}
                <div className="text-xs font-bold lg:hidden opacity-60">
                  Platform
                </div>
                {item.platform == "stripe" ? "Credit Card" : item.platform}
              </span>
              <span className={"capitalize status"}>
                <div className="mb-1 text-xs font-bold lg:hidden opacity-60">
                  Status:
                </div>
                <OrderStatusBadge order={item} />
              </span>
            </Link>
          );
        })}
      </div>
    </ProfileSubPagesLayout>
  );
}
