export type NotificationsType = {
  message: string;
  category: "request" | "invitation" | "messages";
  json_data: any;
  to_user_id: string;
};
