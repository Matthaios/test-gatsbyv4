import React from "react";
import { Link } from "gatsby";
export default function Breadcrumbs({ children, paths, label = null }) {
  return (
    <div className="mb-10 -mt-10 space-x-2 text-base font-semibold print:hidden ">
      {paths?.map((path, index) => {
        return (
          <React.Fragment key={path.to}>
            {index !== 0 && <span>/</span>}
            <Link to={path.to}>{path.label}</Link>
          </React.Fragment>
        );
      })}
      {label && <span>/</span>}
      <span className="break-all text-primary-light"> {label}</span>
      {children}
    </div>
  );
}
