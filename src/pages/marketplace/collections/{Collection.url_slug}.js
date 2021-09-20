import useAllEditions, { useCollection } from "@api/useItems";
import Card from "@components/Card";
import Layout from "@components/Layout";
import { graphql, Link, navigate } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { useState } from "react";
import Breadcrumbs from "@components/Breadcrumbs";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import useAuth from "@api/useAuth";
import ItemsGrid from "@components/ItemsGrid";
import Collections from "@components/Collections";

export default function CollectionPage({ data }) {
  return (
    <Layout>
      <div className="h-[100px] md:h-[180px]"></div>
      <div className="pb-20 mt-10 ">
        <div className="container">
          {" "}
          <Breadcrumbs>
            <span
              className="cursor-pointer"
              onClick={() => {
                window.history?.state?.key
                  ? window.history.back()
                  : navigate("/marketplace");
              }}
            >
              <MdKeyboardArrowLeft className="inline-block" />{" "}
              <FormattedMessage id="back" />
            </span>
          </Breadcrumbs>
        </div>
        <Collections data={data} />
      </div>
    </Layout>
  );
}

export const query = graphql`
  query ($id: String) {
    collection(id: { eq: $id }) {
      ...Collection
    }
  }
`;
