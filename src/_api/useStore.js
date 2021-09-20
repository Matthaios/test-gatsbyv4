import create from "zustand";
import produce from "immer";

const useStore = create((set) => ({
  filter: "All",
  detailsOpen: null,
  auctionsFilters: 0,
  set: (fn) => set(produce(fn)),
}));
export default useStore;
