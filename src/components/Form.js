import { ErrorMessage as ErrorMessageComponent } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";
import tw from "twin.macro";
import cn from "classnames";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NumberFormat from "react-number-format";
import { Global } from "@emotion/react";
import { BiHide, BiShow } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDays, addMinutes, getHours, getMinutes } from "date-fns";
import { useQuery } from "react-query";
import api from "@api/api";
import isFunction from "lodash/isFunction";
export function Form({ onSubmit, children, schema, defaultValues, ...rest }) {
  const methods = useForm({
    resolver: schema ? yupResolver(schema) : undefined,
    defaultValues,
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...rest}>
        {isFunction(children) ? children(methods) : children}
      </form>
    </FormProvider>
  );
}
export function ErrorMessage({ bidOnItem, name, as: Tag = "span" }) {
  const { formState } = useFormContext();

  return (
    <ErrorMessageComponent
      errors={formState.errors}
      name={name}
      render={({ message }) => (
        <Tag className="block text-sm font-semibold leading-5 text-red">
          {message}
        </Tag>
      )}
    />
  );
}
export function Input({ name, validate, options, ...rest }) {
  const { register } = useFormContext(); // retrieve all hook methods
  const [showPassword, setShowPassword] = useState(false);
  const type = rest.type;
  return (
    <>
      {type == "password" ? (
        <div
          className={cn("flex items-center justify-between w-full bg-white", {
            [rest.className]: rest.className,
          })}
        >
          <input
            {...register(name, {
              ...options,
            })}
            {...rest}
            className=""
            type={showPassword ? "text" : "password"}
          />
          {!showPassword && (
            <BiHide
              className="mx-3 opacity-50 cursor-pointer hover:opacity-90 text-primary"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          {showPassword && (
            <BiShow
              className="mx-3 opacity-50 cursor-pointer hover:opacity-90 text-primary"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          )}
        </div>
      ) : (
        <input
          {...register(name, {
            ...options,
          })}
          {...rest}
        />
      )}
    </>
  );
}
export function InputCheckbox({ name, validate, children, options, ...rest }) {
  const { register } = useFormContext(); // retrieve all hook methods
  return (
    <label
      htmlFor={name}
      style={{
        visibility: rest.hidden ? "hidden" : undefined,
        position: rest.hidden ? "absolute" : undefined,
      }}
      className={cn("relative inline-flex items-baseline cursor-pointer")}
    >
      <input
        className="absolute opacity-0"
        id={name}
        {...register(name, {
          ...options,
        })}
        type="checkbox"
        {...rest}
      />
      <span
        css={css`
          ${tw`inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-3 bg-white`}
          i {
            ${tw`block w-3 h-3 bg-transparent`}
          }
          input:checked + & > i {
            ${tw` bg-primary`}
          }
        `}
      >
        <i />
      </span>
      {children}
    </label>
  );
}
export function SubmitButton({ disabled, children, ...rest }) {
  const { formState } = useFormContext(); // retrieve all hook methods
  return (
    <button
      type="submit"
      disabled={formState.isSubmitting || disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
export function InputPrice({ name, options, ...rest }) {
  const { control } = useFormContext();
  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <NumberFormat
          className="disabled:bg-transparent "
          allowNegative={false}
          decimalScale="2"
          onValueChange={(v) => onChange(v.value)}
          value={value}
          {...rest}
        />
      )}
      name={name}
      rules={options}
      control={control}
      fixedDecimalScale
    />
  );
}

export function InputDate({
  name,
  placeholder,
  options,
  type = "date",
  ...rest
}) {
  const { control } = useFormContext();
  const props =
    type == "time"
      ? {
          dateFormat: "h:mm aa",
          timeIntervals: 15,
          showTimeSelect: true,
          showTimeSelectOnly: true,
        }
      : { dateFormat: "MMMM d, yyyy" };
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  return (
    <>
      <Global
        styles={css`
          .react-datepicker-time__header {
            ${tw`text-white`}
          }
          .react-datepicker,
          .react-datepicker__time {
            ${tw`text-white! bg-primary-dark! border-white! border-opacity-20 rounded-none! shadow`}
            button {
              ${tw`outline-none!`}
            }
            &__header {
              ${tw`bg-dark! text-white!`}
            }
            &__header,
            &__current-month,
            &__day-name,
            &__day,
            &__time-name,
            &-container,
            &,
            &-box,
            ul &-list,
            li &-list-item--selected {
              ${tw`text-white!`}
            }
            &__triangle {
              ${tw`hidden`}
            }
            &__day--selected,
            &__day--in-selecting-range,
            &__day--in-range,
            &__month-text--selected,
            &__month-text--in-selecting-range,
            &__month-text--in-range,
            &__quarter-text--selected,
            &__quarter-text--in-selecting-range,
            &__quarter-text--in-range,
            &__year-text--selected,
            &__year-text--in-selecting-range,
            &__year-text--in-range,
            &__day--keyboard-selected,
            &__month-text--keyboard-selected,
            &__quarter-text--keyboard-selected,
            &__year-text--keyboard-selected,
            &__time-name,
            &-container,
            &-list-item--selected {
              ${tw`bg-primary!`}
            }
            &-list-item:hover,
            &__day:hover {
              ${tw`text-dark!  `}
            }
            &__day--disabled,
            &-list-item--disabled {
              ${tw`opacity-30`}
            }
          }
        `}
      />

      <Controller
        render={({ field }) => (
          <DatePicker
            {...rest}
            {...props}
            placeholderText={placeholder}
            selected={field.value}
            dateFormat="MMMM d, yyyy h:mm aa"
            filterTime={filterPassedTime}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            onChange={(date) => {
              const currentDate = new Date();
              const selectedDate = new Date(date);

              if (currentDate.getTime() < selectedDate.getTime()) {
                field.onChange(date);
              } else {
                const minutes = getMinutes(new Date());
                if (minutes > 55) {
                  field.onChange(addMinutes(new Date(), 90 - minutes));
                } else if (minutes > 29) {
                  field.onChange(addMinutes(new Date(), 60 - minutes));
                } else {
                  field.onChange(addMinutes(new Date(), 30 - minutes));
                }
              }
            }}
          />
        )}
        name={name}
        rules={options}
        control={control}
      />
    </>
  );
}

export function Recaptcha({ enabled, type, form }) {
  const frm = useFormContext();
  const { register, setValue, formState, reset } = form || frm;

  useEffect(() => {
    if (enabled) {
      register("captcha", {
        required: "Required field",
      });
    }

    reset({}, { keepValues: true });
  }, [enabled]);
  function onChange(res) {
    setValue("captcha", res);
  }
  useEffect(() => {
    if (formState.isSubmitting) {
      ref?.current?.reset();
    }
  }, [formState.isSubmitting]);
  const ref = React.useRef();
  return enabled ? (
    <div className="flex justify-center my-3">
      {" "}
      <ReCAPTCHA
        ref={ref}
        sitekey="6LdjlmcbAAAAAPj8ljXvoQgoyEP-RxxX6FgoDAME"
        onChange={onChange}
      />
    </div>
  ) : null;
}
