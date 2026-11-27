import axios from "axios";

import { getEnv } from "../../utils/getEnv";

import { handleAccessTokenError } from "../../utils/handleError";
import { getAccessToken } from "../../store/token/accessToken";

import type { User } from "../../types/response";

const getUserData = async (isRtry = false): Promise<User> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get<User>(`${getEnv("VITE_SERVER_HOST")}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRtry, () => getUserData(true));
  }
};

export { getUserData };
