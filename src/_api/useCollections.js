import { graphql, useStaticQuery } from "gatsby";
import { useQuery } from "react-query";
import useAuth from "./useAuth";
import intersection from "lodash/intersection";
import { usePurchases } from "./useProfile";
export default function useCollections(select) {
  const { allCollection } = useStaticQuery(graphql`
    fragment Collection on Collection {
      name
      collection_id
      page_type
      image_url {
        childImageSharp {
          gatsbyImageData
        }
      }
      blurred: image_url {
        childImageSharp {
          gatsbyImageData(width: 40, aspectRatio: 1)
        }
      }
      subname
      description {
        text
        html
      }
      slug: gatsbyPath(
        filePath: "/marketplace/collections/{Collection.url_slug}"
      )
      sets {
        ...Set
      }
    }
    query {
      allCollection {
        nodes {
          ...Collection
        }
      }
    }
  `);
  return useQuery(
    "collections",
    async () => {
      return allCollection.nodes;
    },
    {
      initialData: allCollection.nodes,
      select,
    }
  );
}

export function useCollection(collection_id) {
  return useCollections((d) => d.find((i) => i.collection_id == collection_id));
}

export const useUserCollections = () => {
  const allCollections = useCollections();

  const { data: purchases, isLoading } = usePurchases((data) => {
    return data.purchases.map((i) => i.edition_id);
  });

  var collections = new Set();

  purchases &&
    allCollections.data.forEach(({ collection_id, sets }) => {
      sets.forEach((set) => {
        const editions = set.editions.map((e) => e.edition_id);
        const inter = intersection(purchases, editions);
        if (inter.length > 0) {
          collections.add(collection_id);
        }
      });
    });
  return { isLoading, collections: Array.from(collections) };
};
