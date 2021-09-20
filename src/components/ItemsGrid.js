import React from "react";

export default function ItemsGrid({ children }) {
  return (
    <div className="row cols-full sm:cols-1/2 md:cols-1/3 lg:cols-1/4 row-x-3 row-y-10 ">
      {children}
    </div>
  );
}
