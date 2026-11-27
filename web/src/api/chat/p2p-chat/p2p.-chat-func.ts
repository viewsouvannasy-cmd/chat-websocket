import { getAccessToken } from "../../../store/token/accessToken";
import axios from "axios";

import { getEnv } from "../../../utils/getEnv";

import { handleAccessTokenError } from "../../../utils/handleError";
import type { P2PList } from "../../../types/response";

export const getP2PList = async (isRetry = false): Promise<P2PList> => {
  try {
    const access = getAccessToken();

    const res = await axios.get(`${getEnv("VITE_SERVER_HOST")}/p2p-chat`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () => getP2PList(true));
  }
};
