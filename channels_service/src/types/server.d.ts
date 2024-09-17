interface Category {
  id: string;
  name: string;
  serverId: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  serverId: string;
}

interface ServerMember {
  id: string;
  id_user: string;
  role: string;
  joinedAt: string;
  serverId: string;
  isActiveInServer: boolean;
}

interface Channel {
  id: string;
  name: string;
  CategoryID: string;
  ServerID: string;
  type: "VIDEO" | "TEXT";
}

export interface Server {
  id: string;
  name: string;
  avatarURL: string;
  privacity: PrivacityServer;
  id_user: string;
  createdAt: string;
  url: string;
  categories: Category[];
  events: Event[];
  members: ServerMember[];
  channels: Channel[];
}
