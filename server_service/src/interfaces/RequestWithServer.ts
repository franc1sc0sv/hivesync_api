import RequestWithUser from "./auth_interface";
import { Servers } from "@prisma/client";

interface RequestServer extends RequestWithUser {
  server?: Servers;
}

export default RequestServer;
