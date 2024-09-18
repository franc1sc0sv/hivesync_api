export type messages = {
  id: string;
  message: string;
  id_sender: string;
  room: string;
  sendAt: Date;
};

export type GroupedMessagesType = {
  id_user: string;
  sendAt: Date;
  messages: MessageFormatedArray;
};

export type MessageFormated = {
  id: string;
  message: string;
};

export type GroupedMessagesTypeArray = GroupedMessagesType[];

export type MessageFormatedArray = MessageFormated[];
