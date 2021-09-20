import "./src/styles/tailwind.css";
import "./src/styles/prose.css";
import "./src/styles/layout.css";
import "./src/styles/custom.css";
import React from "react";
import RootElement from "./src/components/RootElement";

export function wrapRootElement({ element }) {
  return <RootElement>{element}</RootElement>;
}
