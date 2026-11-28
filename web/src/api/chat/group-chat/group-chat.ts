import { useQuery, useMutation } from "@tanstack/react-query";
import {
  addMember,
  createGroupChat,
  deleteGroup,
  getGroupChat,
  getGroupDetail,
  getGroupList,
  outOffGroup,
  sendMessageGroup,
} from "./group-chat-func";

import { queryClient } from "../../../main";

export const useGetGroupList = () => {
  return useQuery({
    queryFn: () => getGroupList(false),
    queryKey: ["group-chat"],
  });
};

export const useCreateGroupChat = () => {
  return useMutation<void, void, { group_name: string }>({
    mutationFn: (variable) => createGroupChat(false, variable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-chat"] });
    },
  });
};

export const useDeleteGroup = () => {
  return useMutation<void, void, { g_id: number }>({
    mutationFn: (variable) => deleteGroup(false, variable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-chat"] });
    },
  });
};

export const useAddMember = () => {
  return useMutation<
    { g_id: number },
    void,
    { g_id: number; user_id_to_member: number }
  >({
    mutationFn: (variable) => addMember(false, variable),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["group-chat-detail", data.g_id],
      });
    },
  });
};

export const useOutOffGroup = () => {
  return useMutation<void, void, { g_id: number }>({
    mutationFn: (variable) => outOffGroup(false, variable),
  });
};

// ======== chat ============

export const useGetGroupDetail = (g_id: number) => {
  return useQuery({
    queryFn: () => getGroupDetail(false, { g_id }),
    queryKey: ["group-chat-detail", g_id],
  });
};

export const useGetGroupChat = (g_id: number) => {
  return useQuery({
    queryFn: () => getGroupChat(false, { g_id }),
    queryKey: ["group-chat", g_id],
  });
};

export const useSendMessageGroup = () => {
  return useMutation<
    void,
    void,
    { g_id: number; gm_id: number; content: string }
  >({
    mutationFn: (variable) => sendMessageGroup(false, variable),
  });
};
