import { useQuery, useMutation } from "@tanstack/react-query";
import { getWorldChat, sendWorldChat } from "./world-chat-func";

import type { WroldChat } from "../../../types/response";

const useGetWorldChat = () => {
  return useQuery({
    queryFn: () => getWorldChat(),
    queryKey: ["world-chat"],
  });
};

const useSendWorldChat = () => {
  return useMutation<WroldChat, void, { content: string }>({
    mutationFn: (variable) => sendWorldChat(true, variable),
  });
};

export { useGetWorldChat, useSendWorldChat };
