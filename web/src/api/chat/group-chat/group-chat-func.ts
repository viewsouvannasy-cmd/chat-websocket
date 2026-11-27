import axios from "axios";

import { getEnv } from "../../../utils/getEnv";

import { getAccessToken } from "../../../store/token/accessToken";

import { handleAccessTokenError } from "../../../utils/handleError";

import type {
  GroupChat,
  GroupDetail,
  GroupList,
  SearchUser,
} from "../../../types/response";

const getGroupList = async (isRetry = false): Promise<GroupList> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get<GroupList>(
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

const outOffGroup = async (
  isRetry = false,
  { g_id }: { g_id: number },
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}/out`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      outOffGroup(true, { g_id }),
    );
  }
};

const getGroupDetail = async (
  isRetry = false,
  { g_id }: { g_id: number },
): Promise<GroupDetail> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get(
      `${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}/detail`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      getGroupDetail(true, { g_id }),
    );
  }
};

const getGroupChat = async (
  isRetry = false,
  { g_id }: { g_id: number },
): Promise<GroupChat> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.get<GroupChat>(
      `${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}/chat`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      getGroupChat(true, { g_id }),
    );
  }
};

const sendMessageGroup = async (
  isRetry = false,
  {
    g_id,
    gm_id,
    content,
  }: {
    g_id: number;
    gm_id: number;
    content: string;
  },
): Promise<void> => {
  try {
    const accessToken = getAccessToken();
    await axios.post(
      `${getEnv("VITE_SERVER_HOST")}/group-chat/${g_id}/${gm_id}/send`,
      {
        content,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  } catch (error) {
    return await handleAccessTokenError(error, isRetry, () =>
      sendMessageGroup(true, { g_id, gm_id, content }),
    );
  }
};

const searchUserForGroup = async (
  isRety = false,
  { search, group_id }: { search: string; group_id: number },
): Promise<SearchUser> => {
  try {
    const accessToken = getAccessToken();
    const res = await axios.post<SearchUser>(
      `${getEnv("VITE_SERVER_HOST")}/user/search`,
      {
        search,
        group_id,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return res.data;
  } catch (error) {
    return await handleAccessTokenError(error, isRety, () =>
      searchUserForGroup(true, { search, group_id }),
    );
  }
};

export {
  getGroupList,
  createGroupChat,
  deleteGroup,
  addMember,
  outOffGroup,
  getGroupDetail,
  getGroupChat,
  sendMessageGroup,
  searchUserForGroup,
};
