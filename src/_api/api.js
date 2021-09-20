import JwtAuth from "@utils/JwtAuth";

export default function api(pathname, options) {
  return fetch(
    `${process.env.GATSBY_API_URL}${pathname}`,
    Object.assign(
      {},
      {
        headers: {
          Authorization: JwtAuth.getToken() ?? undefined,
        },
      },
      options
    )
  );
}
