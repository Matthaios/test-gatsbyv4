const _ = require("lodash");
const path = require(`path`);
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const fetch = require("node-fetch");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(
    `
      {
        pages: allPrismicPage {
          nodes {
            uid
          }
        }
      }
    `
  );

  data.pages.nodes.forEach(({ uid }) => {
    createPage({
      path: uid === "homepage" ? "/" : `/${uid}/`,
      component: path.resolve("./src/templates/page.js"),
      context: { uid },
    });
  });
};

// This is needed for the Web3 to work with Gatsby 3
exports.onCreateWebpackConfig = ({ actions, stage, plugins }) => {
  if (stage === "build-javascript" || stage === "develop") {
    actions.setWebpackConfig({
      plugins: [
        plugins.provide({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ],
    });
  }
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        os: require.resolve("os-browserify/browser"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        path: require.resolve("path-browserify"),
        url: require.resolve("url/"),
        buffer: false,
      },
    },
  });
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  function createNodeFromData(type, data) {
    const id = data.edition_id || data.collection_id || data.set_id;

    const nodeContent = JSON.stringify(data);
    const nodeMeta = {
      id: createNodeId(type + "_" + id),
      parent: null,
      children: [],
      internal: {
        type,
        content: nodeContent,
        contentDigest: createContentDigest(data),
      },
    };
    const node = Object.assign({}, data, nodeMeta);
    return createNode(node);
  }

  await fetch(`${process.env.GATSBY_API_URL}/item/get-all-items`)
    .then((res) => res.json())

    .then((data) => {
      data.map((item) =>
        createNodeFromData("Edition", {
          ...item,
        })
      );
      return;
    });

  [].map((item) => {
    let collection = item;
    let sets = collection.sets;

    collection.sets = collection.sets.map((s) => s.set_id);
    sets.forEach((set) => {
      createNodeFromData("Set", {
        ...set,
        // collection: collection.collection_id,
      });
    });
    createNodeFromData("Collection", collection);
  });
  return;
};

exports.onCreateNode = async ({
  node,
  getCache,
  getNode,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  function createNodeFromData(type, data) {
    const id = data.edition_id || data.collection_id || data.set_id;

    const nodeContent = JSON.stringify(data);
    const nodeMeta = {
      id: createNodeId(type + "_" + id),
      parent: null,
      children: [],
      internal: {
        type,
        content: nodeContent,
        contentDigest: createContentDigest(data),
      },
    };
    const node = Object.assign({}, data, nodeMeta);
    return createNode(node);
  }
  if (node.internal.type === "Edition") {
    await Promise.all(
      node.assets.map((asset) => {
        if (/jpg|jpeg|png|gif|\.glb/.test(asset.url)) {
          return createRemoteFileNode({
            url: asset.url,
            parentNodeId: node.id,
            getCache,
            createNode,
            createNodeId,
          });
        } else {
          return asset;
        }
      })
    )
      .then((assetsNodes) => {
        if (!assetsNodes) {
          return;
        }
        const thumbnail = assetsNodes.find((asset) =>
          /jpg|jpeg|png|gif/.test(asset.extension)
        );
        if (thumbnail && thumbnail.id) {
          node.thumbnail___NODE = thumbnail.id;
        }

        node.media = assetsNodes.map((asset) => {
          if (!asset) {
            return null;
          }
          if (/jpg|jpeg|png/.test(asset.extension)) {
            return { type: "image", file___NODE: asset.id };
          }
          if (/gif/.test(asset.extension)) {
            return { type: "gif", file___NODE: asset.id };
          }

          if (/glb/.test(asset.extension)) {
            return { type: "object", url: asset.url, file___NODE: asset.id };
          }

          return { type: "video", url: asset.url };
        });

        return null;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (
    node.internal.type === "PrismicCollection" &&
    node.data.environment === process.env.ENVIRONMENT
  ) {
    createNodeFromData("Collection", {
      collection_id: node.id,
      name: _.get(node, "data.title.text"),
      subname: _.get(node, "data.subname"),
      page_type: _.get(node, "data.page_type"),
      image_url: _.get(node, "data.image.url"),
      url_slug: node.uid,
      description: _.get(node, "data.description"),

      sets: node.data.body.map((edition, index) => `${node.id}_set_${index}`),
    });

    node.data.body.forEach((body, index) => {
      body.items.forEach((edition) => {
        createNodeFromData("PrismicEdition", edition);
      });
      createNodeFromData("Set", {
        set_id: `${node.id}_set_${index}`,
        set_name: _.get(body, "primary.title1.text"),
        set_image_url: _.get(body, "primary.image1.url"),
        slug: _.get(body, "primary.slug"),
        set_description: _.get(body, "primary.description1"),
        editions: body.items.map((item) => {
          return parseInt(item.edition_id);
        }),
      });
    });
  }
  if (
    node.internal.type === "PrismicMarketplaceCollections" &&
    node.data.environment === process.env.ENVIRONMENT
  ) {
    console.log(node.data);
    createNodeFromData("MarketplaceCollections", {
      data: node.data,
      collections: node.data.collections.map(({ collection }) => {
        return collection.uid;
      }),
    });
  }
};

exports.createSchemaCustomization = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createFieldExtension, createTypes, createNode } = actions;

  createFieldExtension({
    name: "remote",
    extend(options, prevFieldConfig) {
      return {
        resolve(source, args, context, info) {
          const fieldValue = context.defaultFieldResolver(
            source,
            args,
            context,
            info
          );
          if (!fieldValue) {
            return null;
          }
          return createRemoteFileNode({
            url: fieldValue,
            store,
            cache,
            createNode,
            createNodeId,
            reporter,
          });
        },
      };
    },
  });

  const typeDefs = `
    type Edition implements Node {
      belongsToSets: [Set]
    }

    type Set implements Node  {
      set_id: String
      set_name: String
      slug: String
      set_description: Description
      set_image_url: File
      editions: [Edition] @link(by: "edition_id")
      collection: Collection @link(by:"collection_id")
    }
    type MarketplaceCollections implements Node {
      collections:  [Collection] @link(by: "url_slug")
    }
    type Description {
      html: String
      text: String
    }
    type Collection implements Node {
      collection_id: String
      name:String
      page_type:String
      description: Description
      subname: String
      url_slug: String
      sets:  [Set] @link(by:"set_id")
      image_url: File
    }
  `;

  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Edition: {
      belongsToSets: {
        type: ["Set"],
        resolve(source, args, context, info) {
          return context.nodeModel
            .getAllNodes({ type: "Set" })
            .filter((set) => set && set.editions.includes(source.edition_id));
        },
      },
      locked_message: {
        type: "String",
        resolve(source, args, context, info) {
          return _.get(
            context.nodeModel
              .getAllNodes({ type: "PrismicEdition" })
              .find((pe) => {
                return String(pe.edition_id) == String(source.edition_id);
              }),
            "locked_item_message.text"
          );
        },
      },
      show_store_buttons: {
        type: "Boolean",
        resolve(source, args, context, info) {
          return _.get(
            context.nodeModel
              .getAllNodes({ type: "PrismicEdition" })
              .find((pe) => {
                return String(pe.edition_id) == String(source.edition_id);
              }),
            "show_store_button"
          );
        },
      },
    },
  };
  createResolvers(resolvers);
};
