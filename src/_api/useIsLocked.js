import { useEffect, useState } from "react";
import { usePurchases } from "./useProfile";

export default function useIsLocked(item) {
  const [isLocked, setIsLocked] = useState(item?.is_locked);
  const { data: eligibility } = usePurchases((data) =>
    data.eligibility.find((e) => e.edition_id == item.edition_id)
  );

  useEffect(() => {
    if (eligibility && eligibility.status == "elegible") {
      setIsLocked(false);
    }
  }, [eligibility?.status]);
  return isLocked;
}
