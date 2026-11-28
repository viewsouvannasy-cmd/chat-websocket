import { getAccessToken } from "../../../store/token/accessToken";
import axios from "axios";

import { getEnv } from "../../../utils/getEnv";

import { handleAccessTokenError } from "../../../utils/handleError";
import type { P2PChat, P2PList, SearchUser } from "../../../types/response";

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

export const createP2P = async (
  isRetry = false,
  { user2_id }: { user2_id: number },
): Promise<void> => {
  try {
    const access = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/p2p-chat`,
      {
        user2_id,
      },
      {
        headers: { Authorization: `Bearer ${access}` },
      },
    );
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      createP2P(false, { user2_id }),
    );
  }
};

export const searchUserForP2P = async (
  isRetry = false,
  { search }: { search: string },
): Promise<SearchUser> => {
  try {
    const access = getAccessToken();

    const res = await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/p2p-chat/search`,
      { search },
      { headers: { Authorization: `Bearer ${access}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      searchUserForP2P(true, { search }),
    );
  }
};

export const getP2PChat = async (
  isRetry = false,
  { pp_id }: { pp_id: number },
): Promise<P2PChat> => {
  try {
    const access = getAccessToken();
    const res = await axios.get(
      `${getEnv("VITE_SERVER_HOST")}/p2p-chat/${pp_id}`,
      {
        headers: { Authorization: `Bearer ${access}` },
      },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      getP2PChat(true, { pp_id }),
    );
  }
};

export const sendMessageP2P = async (
  isRetry = false,
  { pp_id, content }: { pp_id: number; content: string },
): Promise<void> => {
  try {
    const access = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/p2p-chat/${pp_id}/send`,
      { content },
      {
        headers: { Authorization: `Bearer ${access}` },
      },
    );
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      sendMessageP2P(true, { pp_id, content }),
    );
  }
};
