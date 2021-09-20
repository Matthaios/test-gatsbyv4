import useStore from "./useStore";
export default function useMarketplaceUI() {
  const data = useStore();
  const set = useStore((state) => state.set);

  return [data, set];
}
