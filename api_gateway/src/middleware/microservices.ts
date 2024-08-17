import { createProxyMiddleware } from "http-proxy-middleware";

export const FriendsProxyMiddeware = createProxyMiddleware({
  target: "http://hivesync_api-social_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/social": "" },
});

export const UserInfoProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-user_info_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/user_info": "" },
});