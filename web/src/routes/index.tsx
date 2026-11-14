import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useSignIn } from "../api/auth/auth";

import SipnnerLoad from "../components/load-state/SipnnerLoad";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const { mutate, isPending } = useSignIn();

  const handleSignIn = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending) return;

    mutate(
      {
        user_name: userName,
        user_password: userPassword,
      },
      {
        onSuccess: (data) => {
          if (data.ok) {
            navigate({ to: "/app/chat/$chat", params: { chat: "world-chat" } });
          }
        },
        onError: () => {
          console.log("error");
        },
      },
    );
  };

  return (
    <div className="flex h-dvh w-dvw items-center justify-center p-4">
      <form
        onSubmit={handleSignIn}
        className="flex w-full max-w-110 flex-col items-center gap-7"
      >
        <h2 className="mb-5 text-2xl font-medium">LOGIN TO CHAT.</h2>
        <div className="flex w-full flex-col gap-1">
          <label>USER NAME</label>
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            className="border p-2"
            required
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <label>PASSWORD</label>
          <input
            onChange={(e) => setUserPassword(e.target.value)}
            value={userPassword}
            className="border p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-13 w-full cursor-pointer items-center justify-center bg-black text-white"
        >
          {isPending ? <SipnnerLoad /> : "Continue"}
        </button>
      </form>
    </div>
  );
}
