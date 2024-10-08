import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import RequestWithUser from "../interfaces/auth_interface";
import { User } from "../types/user";

const stringify = (user: User | undefined): string => {
  if (!user?.id) return "";
  return Buffer.from(JSON.stringify(user)).toString("base64");
};

export const FriendsProxyMiddeware = createProxyMiddleware({
  target: "http://hivesync_api-social_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/social": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
});

export const UserInfoProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-user_info_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/user_info": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
});

export const ServersProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-server_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/sever": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
});

export const ChannelsProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-channels_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/channels": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
  logger: console,
});

export const NotificationsProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-notifications_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/notifications": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
});
