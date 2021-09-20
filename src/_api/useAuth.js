import JwtAuth from "@utils/JwtAuth";
import useNotification from "@utils/notifications";
import { navigate } from "gatsby-link";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import { useAuctions, usePurchases } from "./useProfile";

export function useToken() {
  const query = useQuery("token", () => {
    const token = JwtAuth.getToken();
    if (JwtAuth.isTokenExpired(token)) {
      return null;
    } else {
      return () => ({ token, userId: JwtAuth.getUserId() });
    }
  });
  useEffect(() => {
    if (!query.isFetched) {
      query.refetch();
    }
  }, []);
  return query;
}

function defaultSelect(data) {
  return {
    ...data?.user,
  };
}
export default function useAuth(select = defaultSelect) {
  const queryClient = useQueryClient();
  const { data: tokenData } = useToken();
  const notifications = useNotification();
  const query = useQuery(
    "auth",
    async () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/user/get-profile/${tokenData?.userId}`,
        {
          headers: {
            Authorization: tokenData?.token,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (!res.user) {
            return null;
          }

          return { ...res };
        });
    },
    {
      onError: () => {
        logout.mutate();
      },
      select: select,
      enabled: Boolean(tokenData?.token),
      retry: 2,
    }
  );

  const logout = useMutation(async () => {
    JwtAuth.logout();
    queryClient.setQueryData("token", null);
    queryClient.setQueryData("auth", null);
    queryClient.setQueryData("cart", null);
    queryClient.removeQueries(["redeem-account"]);
    queryClient.setQueryData("orders", null);
    window.open("/marketplace", "_self");
    return;
  });

  const login = useMutation(
    async ({ captcha, ...user }) => {
      const res = await fetch(`${process.env.GATSBY_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentials: user, captcha, sso: false }),
      });
      if (res.ok) {
        return res.json();
      } else {
        const error = await res.json();
        throw error;
      }
    },
    {
      onSuccess: async (data) => {
        JwtAuth.setToken(data.token, data.user.user_id);
        await queryClient.refetchQueries("token");
        queryClient.refetchQueries("auth");
      },
    }
  );
  const signUp = useMutation(async (userRecord) => {
    const user = {
      ...userRecord,
      user_id: uuid(),
      first_name: "",
      last_name: "",
    };
    const res = await fetch(`${process.env.GATSBY_API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      return res;
    } else {
      const error = await res.json();
      console.log(error);
      if (error == "recaptcha-required") {
        throw error;
      } else {
        throw error?.errors?.[0]?.msg ?? "Error while registering";
      }
    }
  });
  const updateUser = useMutation(
    (data) => {
      return fetch(`${process.env.GATSBY_API_URL}/user/update-profile`, {
        headers: {
          Authorization: JwtAuth.getToken(),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          user_id: JwtAuth.getUserId(),
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
        }),
      });
    },
    {
      onSuccess: () => {
        notifications.info({ text: "User data updated" });
        queryClient.refetchQueries("auth");
      },
    }
  );
  return {
    ...query,
    user: query.data ?? null,
    signUp,
    login,
    updateUser,
    logout: () => logout.mutate(),
  };
}

export function useUsersItem(edition_id, item_id) {
  const query = usePurchases((data) => {
    return (
      data?.purchases?.find((item) => {
        return item.edition_id == edition_id && item.item_id == item_id;
      }) ?? null
    );
  });

  return { ...query, item: query.data };
}

export function useFacebookLogin(redirect) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ access_token, fb_user_id, user_id, first_name }) => {
      return fetch(process.env.GATSBY_API_URL + `/user/fb/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token,
          fb_user_id,
          user_id: user_id || uuid(),
          first_name,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            const error = await res.json();
            throw error;
          }
        })
        .then(async ({ token, user }) => {
          JwtAuth.setToken(token, user.user_id);
          await queryClient.invalidateQueries("token");
          await queryClient.refetchQueries("auth");
          if (redirect) {
            navigate(redirect);
          }
        });
    }
  );
}
export function useGoogleLogin(redirect) {
  const queryClient = useQueryClient();
  return useMutation(async ({ id_token, user_id }) => {
    return fetch(process.env.GATSBY_API_URL + `/user/gg/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token,
        user_id: user_id || uuid(),
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        } else {
          const error = await res.json();
          throw error;
        }
      })
      .then(async ({ token, user }) => {
        JwtAuth.setToken(token, user.user_id);
        await queryClient.invalidateQueries("token");
        await queryClient.refetchQueries("auth");
        if (redirect) {
          navigate(redirect);
        }
      });
  });
}
export function useAppleLogin(redirect) {
  const queryClient = useQueryClient();
  return useMutation(async ({ id_token, first_name, last_name, user_id }) => {
    return fetch(process.env.GATSBY_API_URL + `/user/apl/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token,
        first_name,
        last_name,
        user_id: user_id || uuid(),
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        } else {
          const error = await res.json();
          throw error;
        }
      })
      .then(async ({ token, user }) => {
        JwtAuth.setToken(token, user.user_id);
        await queryClient.invalidateQueries("token");
        await queryClient.refetchQueries("auth");
        if (redirect) {
          navigate(redirect);
        }
      });
  });
}
