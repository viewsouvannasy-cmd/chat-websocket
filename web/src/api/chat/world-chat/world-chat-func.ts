import axios from "axios";

import { getEnv } from "../../../utils/getEnv";

import type { WroldChat } from "./../../../types/response";
import { getAccessToken } from "../../../store/token/accessToken";

import { handleAccessTokenError } from "../../../utils/handleError";

const getWorldChat = async (isRetry = false): Promise<WroldChat> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get<WroldChat>(
      `${getEnv("VITE_SERVER_HOST")}/world-chat`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      getWorldChat(true),
    );
  }
};

const sendWorldChat = async (
  isRetry = false,
  { content }: { content: string },
): Promise<WroldChat> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.post<WroldChat>(
      `${getEnv("VITE_SERVER_HOST")}/world-chat`,
      { content },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      sendWorldChat(true, { content }),
    );
  }
};

export { getWorldChat, sendWorldChat };
