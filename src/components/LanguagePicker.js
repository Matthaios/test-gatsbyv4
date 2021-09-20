import React, { useState } from "react";

import USAFlag from "../images/usa-flag.svg";
import { BsCaretDownFill } from "react-icons/bs";
import Select from "react-select";

import get from "lodash/get";
export default function LanguagePicker() {
  const languageOptions = [{ value: "EN", label: "English", flag: USAFlag }];
  return (
    <div className="language-select  flex-shrink-0">
      <Select
        classNamePrefix="language-select"
        components={{
          Option,
          IndicatorSeparator,
          DropdownIndicator,
          // Control,
          MenuList,
          Menu,
          SingleValue,
          // ValueContainer,
        }}
        isSearchable={false}
        defaultValue={{ value: "EN", label: "English", flag: USAFlag }}
        isClearable={false}
        options={languageOptions}
      ></Select>
    </div>
  );
}

const IndicatorSeparator = () => null;

const SingleValue = ({ innerRef, innerProps, children, ...rest }) => {
  const data = get(rest.getValue(), "[0]");
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="inline-flex items-center text-sm space-x-2 cursor-pointer "
      {...rest}
    >
      {" "}
      <img src={data.flag}></img>
      <span>{data.label}</span>
    </div>
  );
};

const DropdownIndicator = ({ innerProps }) => (
  <div {...innerProps} className="ml-3 cursor-pointer">
    <BsCaretDownFill />
  </div>
);
const MenuList = ({ innerProps, children }) => {
  return <div {...innerProps}>{children}</div>;
};
const Menu = ({ innerProps, children }) => {
  return (
    <div className="absolute" {...innerProps}>
      {children}
    </div>
  );
};
function Option({ innerProps, innerRef, data, ...rest }) {
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center space-x-2 cursor-pointer "
      {...rest}
    >
      {" "}
      <img src={data.flag}></img>
      <span>{data.label}</span>
    </div>
  );
}

function Control(props) {
  return (
    <div className="flex items-center " {...props}>
      {props.children}
    </div>
  );
}
