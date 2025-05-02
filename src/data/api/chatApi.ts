import { baseQueryWithReauth } from "../connectionApis/User";
import { createApi } from "@reduxjs/toolkit/query/react";

interface User {
  _id: string;
  name: string;
  photo?: string;
  seen: boolean;
  isSender: boolean;

}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Messages","ChatUsers"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      void,
      { receiverId: string; message: string }
    >({
      query: ({ receiverId, message }) => ({
        url: "/chat/send",
        method: "POST",
        body: { receiverId, message }, 
      }),
      invalidatesTags: ["Messages"],
    }),


    getMessages: builder.query<any[], string>({
      query: (receiverId) => `/chat/${receiverId}`,
      providesTags: ["Messages"],
    }),


    markMessagesAsSeen: builder.mutation<void, string>({
      query: (receiverId) => ({
        url: `/chat/mark-seen/${receiverId}`,
        method: "PUT",
      }),
      
    }),
    getUsersChat: builder.query<
  {
    total: number;
    users: User[]; 
  },
  { search?: string; page?: number; limit?: number }
>({
  query: ({ search = "", page = 1, limit = 10 }) => ({
    url: `/chat/user-list`,
    params: { search, page, limit },
  }),
  keepUnusedDataFor: 5,
  providesTags: ["ChatUsers"],
}),

  }),
});

export const {
  useGetMessagesQuery,
  useMarkMessagesAsSeenMutation,
  useSendMessageMutation,
  useGetUsersChatQuery,
} = chatApi;
