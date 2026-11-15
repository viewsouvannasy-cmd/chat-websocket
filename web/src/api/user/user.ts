import { useQuery } from "@tanstack/react-query";

import { getUserData } from "./user-func";

const useGetUserData = () => {
  return useQuery({
    queryFn: () => getUserData(),
    queryKey: ["user"],
  });
};

export { useGetUserData };
