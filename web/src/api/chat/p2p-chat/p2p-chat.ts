import { useQuery } from "@tanstack/react-query";
import { getP2PList } from "./p2p.-chat-func";

export const useGetP2PList = () => {
  return useQuery({
    queryFn: () => getP2PList(false),
    queryKey: ["p2p-chat", "list"],
  });
};
