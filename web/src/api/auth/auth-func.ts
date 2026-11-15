import axios from "axios";

import { getEnv } from "../../utils/getEnv";

import { saveAccessToken } from "../../store/token/accessToken";

import type { SignIn } from "../../types/response";

const signin = async ({
  user_name,
  user_password,
}: {
  user_name: string;
  user_password: string;
}): Promise<SignIn> => {
  try {
    const res = await axios.post<SignIn>(
      `${getEnv("VITE_SERVER_HOST")}/auth/signin`,
      {
        user_name,
        user_password,
      },
      { withCredentials: true },
    );
    const response = res.data;
    saveAccessToken(response.data[0].accessToken);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { signin };
