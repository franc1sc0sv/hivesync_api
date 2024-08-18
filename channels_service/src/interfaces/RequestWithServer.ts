import RequestWithUser from "./auth_interface";

enum PrivacityServer {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type Servers = {
  id: string;
  name: string;
  avatarURL: string;
  privacity: PrivacityServer;
  id_user: string;
  createdAt: Date;
};

interface RequestServer extends RequestWithUser {
  server?: Servers;
}

export default RequestServer;
