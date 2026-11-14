import { signin } from "./auth-func";
import { useMutation } from "@tanstack/react-query";

import type { SignIn } from "../../types/response";

export const useSignIn = () => {
  return useMutation<
    SignIn,
    void,
    { user_name: string; user_password: string }
  >({
    mutationFn: (variable) => signin(variable),
  });
};
