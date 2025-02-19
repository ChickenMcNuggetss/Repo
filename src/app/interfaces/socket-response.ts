export interface IUser {
  login: string;
  isLogined: boolean;
}

export interface IMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
}

export interface IUserPayloadResp {
  user: {
    login: string;
    isLogined: boolean;
  };
}

export interface IAllUsers {
  users: [];
}

export interface IRespMessage {
  message: {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: {
      isDelivered: boolean;
      isReaded: boolean;
      isEdited: boolean;
    };
  };
}

export interface IRespMessageHistory {
  messages: [];
}

export type Responses = IUserPayloadResp | IAllUsers | IRespMessage | IRespMessageHistory;
