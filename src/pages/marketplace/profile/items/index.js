import { useEdition } from "@api/useItems";
import { useAuctions, usePurchases } from "@api/useProfile";
import { CardImage } from "@components/Card";
import ItemsGrid from "@components/ItemsGrid";
import LoadingIndicator from "@components/LoadingIndicator";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import { useLocation } from "@reach/router";
import { Link, navigate } from "gatsby";
import get from "lodash/get";
import { parse } from "query-string";
import React from "react";
import { MdClose } from "react-icons/md";

export default function ProfileItems() {
  const { search } = useLocation();
  const { id } = parse(search);
  const { purchases, isLoading: purchasesIsLoading } = usePurchases();
  return (
    <ProfileSubPagesLayout>
      <LoadingIndicator isLoading={purchasesIsLoading} />
      {!purchasesIsLoading && purchases?.length === 0 && (
        <div className="col-span-2 lg:col-span-3">
          <p className="mb-4">
            You don’t have any items. Browse the Marketplace to find items.
          </p>
          <p>
            <Link to="/marketplace" className="button">
              Go to Marketplace
            </Link>
          </p>
        </div>
      )}
      {search && (
        <div className="col-span-2 lg:col-span-3">
          <p className="mb-8">
            <span
              onClick={() => {
                navigate("/marketplace/profile/items");
              }}
              className="inline-flex items-center px-4 py-2 space-x-2 cursor- bg-primary "
            >
              Id: {id} <MdClose className="ml-3" />
            </span>
          </p>
        </div>
      )}
      {!purchasesIsLoading && purchases?.length > 0 && (
        <div>
          <ItemsGrid>
            {" "}
            {purchases
              ?.sort((a, b) => {
                return (
                  new Date(b?.history?.[0]?.purchase_date) -
                  new Date(a?.history?.[0]?.purchase_date)
                );
              })
              ?.filter((item) => {
                if (!search) {
                  return true;
                } else {
                  return id == item.edition_id;
                }
              })
              ?.map((item, index) => {
                return (
                  <Card
                    key={index}
                    // isAuction={item.history?.find((hit) => hit.isAuction)}
                    edition_id={item.edition_id}
                    item_id={item.item_id}
                  />
                );
              })}
          </ItemsGrid>
        </div>
      )}
    </ProfileSubPagesLayout>
  );
}

function Card({ item_id, edition_id }) {
  const { item } = useEdition(edition_id);

  const { data: isAuction } = useAuctions((data) =>
    data.auctions.find(
      (a) => a.edition_id == edition_id && a.item_id == item_id && !a.completed
    )
  );
  return item ? (
    <div className="flex flex-col items-stretch">
      <Link to={`${edition_id}/${item_id}`}>
        <div className="h-52 xl:h-64">
          <CardImage data={item} />
        </div>
      </Link>
      <div className="mt-6 ">
        <h3 className="mb-1 text-base font-semibold">
          {item.edition_name}{" "}
          {isAuction ? (
            <span className="text-xs text-green">[ON AUCTION]</span>
          ) : null}
        </h3>
        <p className="overflow-hidden text-sm opacity-75">
          {truncate(get(item, "description", ""))}
        </p>
      </div>
    </div>
  ) : null;
}
function truncate(text) {
  const LENGTH = 80;
  if (text.length <= LENGTH) {
    return text;
  } else {
    return text.slice(0, LENGTH) + " ...";
  }
}
