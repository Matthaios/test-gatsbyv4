import React from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

export default function Cart() {
  return (
    <div className="absolute left-0 top-0 w-full">
      <div className="container tablet:hidden ">
        <div className="flex items-center justify-end space-x-8">
          <div>
            <FaSearch />
          </div>
          <div className="bg-primary text-white py-3 inline-flex items-center px-4">
            <FaShoppingCart className="mr-3" /> 2 Items
          </div>
        </div>
      </div>
    </div>
  );
}
