import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clearAdmin } from "../../domain/redux/slilce/userSlice";
// import { clearAdmin } from "../../domain/redux/slilce/adminSlice";

interface RefreshResponse {
  accessToken: string;
}

const baseQueryAdmin = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/admin",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});


export const baseQueryWithAdminReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions = {}) => { 
  let result = await baseQueryAdmin(args, api, extraOptions);


  if (
    result?.error?.status === 401 && 
    (args as FetchArgs).url !== "/refresh-token"
  ) {
    console.log("Refreshing token before retrying request...");


    const refreshResult = await baseQueryAdmin(
      {
        url: "/refresh-token",
        method: "POST",
        credentials: "include", 
      },
      api,
      extraOptions
    );



    if (refreshResult.data) {

      const newAccessToken = (refreshResult.data as RefreshResponse).accessToken;

      localStorage.setItem("adminToken", newAccessToken);


      extraOptions = extraOptions || {}; 
      (extraOptions as Record<string, any>).headers = { 
        ...(extraOptions as Record<string, any>).headers, 
        authorization: `Bearer ${newAccessToken}` 
      };


      result = await baseQueryAdmin(args, api, extraOptions);
    } else {
      console.log("Refresh token failed, logging out...");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("refreshToken");
      api.dispatch(clearAdmin());
      return refreshResult;
    }
  }

  return result;
};
