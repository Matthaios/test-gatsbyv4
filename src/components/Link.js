import { Link as GatsbyLink } from "gatsby";
import React from "react";

export default function Link({
  to,
  as: asTag,
  activeClassName,
  children,
  ...rest
}) {
  let Tag = asTag;

  if (!asTag) {
    Tag = to ? (to.toString().startsWith("http") ? "a" : GatsbyLink) : "button";
  }

  const props = {};
  to && to.startsWith("http") ? (props.href = to) : (props.to = to);
  to && !to.startsWith("http") && (props.activeClassName = activeClassName);
  return (
    <Tag {...props} {...rest}>
      {children}
    </Tag>
  );
}
