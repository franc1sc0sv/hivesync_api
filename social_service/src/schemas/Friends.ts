import { z } from "zod";

export const SendFriendRequestSchema = z.object({
  WhoReciveTheRequest: z.string().uuid(),
});

export const AcceptFriendRequestSchema = z.object({
  requestId: z.string().uuid(),
});

export const ListFriendsSchema = z.object({
  userId: z.string().uuid(),
});

export const RejectFriendRequestSchema = z.object({
  requestId: z.string().uuid(),
});

export const DeleteFriendSchema = z.object({
  friendId: z.string().uuid(),
});

export type SendFriendRequestType = z.infer<typeof SendFriendRequestSchema>;
export type ListFriendsType = z.infer<typeof ListFriendsSchema>;
export type AcceptFriendRequestType = z.infer<typeof AcceptFriendRequestSchema>;
