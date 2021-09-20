import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import isFunction from "lodash/isFunction";
import flatMap from "lodash/flatMap";
import auctionUtils from "./auctionUtils";
export default function Sort(data, options) {
  const sort = options?.sort || { key: "item_id", order: "asc" };
  const group = options?.group || {
    key: (item) => {
      const stage = auctionUtils.getStage(item);
      switch (stage) {
        case "ongoing":
          return 1;
        case "processing":
          return 2;
        case "waiting":
          return 3;
        case "ended":
          return 4;
        default:
          return 5;
      }
    },
    order: "asc",
  };
  if (!data) {
    return null;
  }
  const sorted = sortBy(data, isFunction(sort.key) ? sort.key : [sort.key]);

  var grouped = sortBy(
    groupBy(sorted, isFunction(group.key) ? group.key : [group.key]),
    (i) => i.key
  );
  if (group.order == "desc") {
    grouped = grouped.reverse();
  }

  return flatMap(grouped);
}
