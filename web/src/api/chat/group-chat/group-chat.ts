import { useQuery, useMutation } from "@tanstack/react-query";
import { createGroupChat, getGroupList } from "./group-chat-func";

import { queryClient } from "../../../main";

export const useGetGroupList = () => {
  return useQuery({
    queryFn: () => getGroupList(false),
    queryKey: ["group-chat"],
  });
};

export const useCreateGroupChat = () => {
  return useMutation<void, void, { group_name: string }>({
    mutationFn: (variable) => createGroupChat(true, variable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-chat"] });
    },
  });
};
