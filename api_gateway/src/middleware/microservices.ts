import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import RequestWithUser from "../interfaces/auth_interface";

export const FriendsProxyMiddeware = createProxyMiddleware({
  target: "http://hivesync_api-social_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/social": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", JSON.stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
  logger: console,
});

export const UserInfoProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-user_info_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/user_info": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", JSON.stringify(req.user));
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
      proxyReq.setHeader("user", JSON.stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
  logger: console,
});

export const ChannelsProxyMiddleware = createProxyMiddleware({
  target: "http://hivesync_api-channels_service-1:3000/api/v1",
  changeOrigin: true,
  pathRewrite: { "^/channels": "" },
  on: {
    proxyReq: (proxyReq, req: RequestWithUser) => {
      proxyReq.setHeader("user", JSON.stringify(req.user));
      fixRequestBody(proxyReq, req);
    },
  },
});
