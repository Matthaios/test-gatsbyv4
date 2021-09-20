import useAllEditions, { useMarketplaceItems } from "@api/useItems";
import Card from "@components/Card";
import CollectionSlider from "@components/CollectionSlider";
import HeroSliderV2 from "@components/HeroSliderV2";
import ItemsGrid from "@components/ItemsGrid";
import Layout from "@components/Layout";
import Icon from "@images/no-items-icon.png";
import Search from "@components/Search";
import cn from "classnames";
import { graphql } from "gatsby";
import { matchSorter } from "match-sorter";
import React, { useMemo, useState } from "react";
export default function Marketplace({ data }) {
  const { data: items } = useMarketplaceItems();
  const { data: allItems } = useAllEditions();

  const [search, setSearch] = useState("");
  const results = useMemo(() => {
    if (search.trim() === "") {
      return items;
    }
    return matchSorter(allItems, search, {
      keys: ["edition_name", "description"],
    });
  }, [search, items?.length]);

  const isSearching = search.trim() != "";

  return (
    <div>
      <Layout>
        <HeroSliderV2 />
        <Search {...{ setSearch }} />
        <div className="flex flex-col items-stretch">
          {data.marketplaceCollections?.collections?.map(
            (collection, index) => {
              return (
                <CollectionSlider
                  expanded={
                    data.marketplaceCollections?.data?.collections?.[index]
                      ?.list_individual_sets
                  }
                  key={collection.collection_id}
                  collection={collection}
                ></CollectionSlider>
              );
            }
          )}

          <div
            className={cn("container my-20", {
              "order-first": isSearching,
            })}
          >
            {isSearching && results?.length === 0 && (
              <div className="container max-w-4xl pt-12 pb-20 text-center ">
                <img src={Icon} className="mx-auto" />
                <div className="mt-8 prose">
                  <h2>No search Results!</h2>
                </div>
              </div>
            )}
            {results?.length > 0 && (
              <div className="mb-8 prose max-w-none">
                <h2>{isSearching ? "Search results" : "Marketplace items"}</h2>
              </div>
            )}

            <div>
              {" "}
              <ItemsGrid>
                {" "}
                {results &&
                  results
                    .filter((item) => {
                      if (isSearching) {
                        return true;
                      } else {
                        return !item.is_redemption;
                      }
                    })
                    .map((item, index) => (
                      <div key={item.edition_id}>
                        <Card data={item} isExtended />
                      </div>
                    ))}
              </ItemsGrid>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export const query = graphql`
  query {
    marketplaceCollections {
      collections {
        ...Collection
      }
      data {
        collections {
          list_individual_sets
        }
      }
    }
  }
`;
