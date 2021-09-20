import format from "date-fns/format";
export default function formatDate(date, formatString = "MM/dd/yyyy") {
  return date ? format(new Date(date), formatString) : "";
}
