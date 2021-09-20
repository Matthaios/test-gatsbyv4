import * as yup from "yup";
import { useIntl } from "react-intl";
import { PasswordRegex } from "@utils/regex";

export function useSchema() {
  const intl = useIntl();
  return yup.object().shape({
    email: yup
      .string()
      .email(intl.formatMessage({ id: "forms.valid_email_message" }))
      .required(intl.formatMessage({ id: "forms.required_field_message" })),

    password: yup
      .string()
      .min(8, intl.formatMessage({ id: "forms.password_short_message" }))
      .max(100, intl.formatMessage({ id: "forms.password_long_message" }))
      .required(intl.formatMessage({ id: "forms.required_field_message" }))
      .matches(
        PasswordRegex,
        intl.formatMessage({ id: "forms.password_rules" })
      ),
  });
}
