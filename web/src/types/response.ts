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

export interface WroldChat extends BaseResponse {
  data: {
    wc_id: number;
    user_id: number;
    content: string;
    create_at: Date;
    user_name: string;
  }[];
}
