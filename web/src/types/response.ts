export interface BaseResponse {
  ok: boolean;
  msg: string;
}

export interface SignIn extends BaseResponse {
  data: [{ accessToken: string }];
}

export interface User extends BaseResponse {
  data: [
    {
      user_id: number;
      user_name: string;
      content: string;
      create_at: Date;
    },
  ];
}

export interface SearchUser extends BaseResponse {
  data: {
    user_id: number;
    user_name: string;
  }[];
}

export interface WroldChat extends BaseResponse {
  data: {
    wc_id: number;
    user_id: number;
    content: string;
    create_at: Date;
    user_name: string;
  }[];
}

export interface GroupList extends BaseResponse {
  data: Group[];
}

export interface Group {
  g_id: number;
  group_name: string;
  is_owner: boolean;
  members: string[];
}

export interface GroupDetail extends BaseResponse {
  data: {
    group_name: string;
    user_name: string;
  }[];
}

export interface GroupChat extends BaseResponse {
  data: [
    {
      user_id: number;
      user_member_id: number;
      chats: Message[];
    },
  ];
}

export interface P2PList extends BaseResponse {
  data: {
    pp_id: number;
    u1: string;
    u2: string;
    user_created: number;
    opposite_user: "u1" | "u2";
    last_content: string;
    create_at: Date;
  }[];
}

export interface P2PChat extends BaseResponse {
  data: [
    {
      user_id: number;
      opposite_user_name: string;
      chats: Message[];
    },
  ];
}

export interface Message {
  user_id: number;
  content: string;
  create_at: Date;
  user_name: string;
}
