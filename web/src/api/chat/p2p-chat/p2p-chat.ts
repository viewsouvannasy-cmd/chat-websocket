import { useMutation, useQuery } from "@tanstack/react-query";
import { createP2P, getP2PList } from "./p2p-chat-func";

import { queryClient } from "../../../main";

export const useGetP2PList = () => {
  return useQuery({
    queryFn: () => getP2PList(false),
    queryKey: ["p2p-chat", "list"],
  });
};

export const useCreateP2P = () => {
  return useMutation<void, void, { user2_id: number }>({
    mutationFn: (variable) => createP2P(false, variable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["p2p-chat", "list"] });
    },
  });
};
