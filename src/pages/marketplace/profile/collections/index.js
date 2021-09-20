import { useCollection, useUserCollections } from "@api/useCollections";
import ItemsGrid from "@components/ItemsGrid";
import LoadingIndicator from "@components/LoadingIndicator";
import ProfileSubPagesLayout from "@components/ProfileSubPagesLayout";
import { css } from "@emotion/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";
import { FormattedMessage } from "react-intl";

export default function Collections() {
  const { collections, isLoading } = useUserCollections();
  return (
    <ProfileSubPagesLayout>
      <LoadingIndicator isLoading={isLoading} robot />
      {!isLoading && collections?.length === 0 && (
        <div className="col-span-2 lg:col-span-3">
          <p className="mb-4">
            You don’t have any collection items. Browse the marketplace to find
            items.
          </p>
          <p>
            <Link to="/marketplace" className="button">
              Go to Marketplace
            </Link>
          </p>
        </div>
      )}
      <ItemsGrid>
        {" "}
        {!isLoading &&
          collections?.map((collection) => {
            return (
              <CollectionCard key={collection} collection_id={collection} />
            );
          })}
      </ItemsGrid>
    </ProfileSubPagesLayout>
  );
}

function CollectionCard({ collection_id }) {
  const { data: collection } = useCollection(collection_id);

  return (
    <div>
      <Link
        to={collection.slug}
        className="relative block h-40 overflow-hidden xl:h-56"
      >
        <GatsbyImage
          layout="constrained"
          style={{ height: "100%", width: "100%" }}
          width={"100%"}
          height={"100%"}
          image={collection?.image_url?.childImageSharp?.gatsbyImageData}
        />

        <div
          className="absolute inset-0 "
          css={css`
            background: linear-gradient(
              -30deg,
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.2) 30%
            );
          `}
        ></div>
      </Link>
      <div className="mt-4 ">
        <h3 className="mb-1 text-base font-semibold">{collection?.name}</h3>
        <p className="overflow-hidden text-sm opacity-75">
          {collection?.subname}
        </p>
        <Link
          to={collection.slug}
          className="mt-3 text-sm cursor-pointer button"
        >
          <FormattedMessage id="learn_more" />
        </Link>
      </div>
    </div>
  );
}
