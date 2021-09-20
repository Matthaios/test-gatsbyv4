export default function turnErrorToString(err) {
  switch (typeof err) {
    case "string":
      return err;
    case "object":
      return JSON.stringify(err, null, 2);

    default:
      return null;
  }
}
