export interface BaseResponse {
  ok: boolean;
  msg: string;
}

export interface SignIn extends BaseResponse {
  data: [{ accessToken: string }];
}
