import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query";
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearUser } from "../../domain/redux/slilce/userSlice";

interface RefreshResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/user",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});



export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error?.status === 401 &&
    (args as FetchArgs).url !== "/refresh-token"
  ) {
    const token = localStorage.getItem("userToken");

    // ✅ Prevent refresh attempt if userToken is not present (user logged out)
    if (!token) {
      api.dispatch(clearUser());
      return {
        error: {
          status: 401,
          data: "Unauthorized - No access token",
        },
      };
    }

    const refreshResult = await baseQuery(
      {
        url: "/refresh-token",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as RefreshResponse)
        .accessToken;
      localStorage.setItem("userToken", newAccessToken);

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.removeItem("userToken");
      api.dispatch(clearUser());
      return refreshResult;
    }
  }

  return result;
};
