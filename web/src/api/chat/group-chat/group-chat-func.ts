import axios from "axios";

import { getEnv } from "../../../utils/getEnv";

import { getAccessToken } from "../../../store/token/accessToken";

import { handleAccessTokenError } from "../../../utils/handleError";

import type { GroupChat } from "../../../types/response";

const getGroupList = async (isRetry = false): Promise<GroupChat> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get<GroupChat>(
      `${getEnv("VITE_SERVER_HOST")}/group-chat`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      getGroupList(true),
    );
  }
};

const createGroupChat = async (
  isRetry = false,
  { group_name }: { group_name: string },
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/group-chat`,
      { group_name },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      createGroupChat(true, { group_name }),
    );
  }
};

const deleteGroup = async (
  isRetry = false,
  { g_id }: { g_id: number },
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axios.delete(`${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      deleteGroup(true, { g_id }),
    );
  }
};

const addMember = async (
  isRetry = false,
  { g_id, user_id_to_member }: { g_id: number; user_id_to_member: number },
): Promise<{ g_id: number }> => {
  try {
    const accessToken = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}/member/add/${user_id_to_member}`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return { g_id };
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      addMember(true, { g_id, user_id_to_member }),
    );
  }
};

export { getGroupList, createGroupChat, deleteGroup, addMember };
