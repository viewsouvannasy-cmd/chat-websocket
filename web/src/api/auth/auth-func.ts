import axios from "axios";

import { getEnv } from "../../utils/getEnv";

import type { SignIn } from "../../types/response";

const signin = async ({
  user_name,
  user_password,
}: {
  user_name: string;
  user_password: string;
}): Promise<SignIn> => {
  try {
    const res = await axios.post(`${getEnv("VITE_SERVER_HOST")}/auth/signin`, {
      user_name,
      user_password,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { signin };
