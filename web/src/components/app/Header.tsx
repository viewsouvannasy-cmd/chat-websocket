import { Link } from "@tanstack/react-router";

import { useGetUserData } from "../../api/user/user";

export function Header({
  section,
}: {
  section: "world-chat" | "group-chat" | "p2p-chat";
}) {
  const { data } = useGetUserData();

  return (
    <div className="flex w-full items-center justify-between gap-3 bg-white p-2">
      <div className="font-semibold">{data?.data[0]?.user_name}</div>
      <div>
        <Link
          to="/app/chat/world-chat"

          className={`cursor-pointer px-3 py-1 text-sm font-semibold ${section === "world-chat" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
        >
          World
        </Link>
        <Link
          to="/app/chat/group"

          className={`cursor-pointer px-3 py-1 text-sm font-semibold ${section === "group-chat" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
        >
          Group
        </Link>
        <Link
          to="/app/chat/p2p-chat"

          className={`cursor-pointer px-3 py-1 text-sm font-semibold ${section === "p2p-chat" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
        >
          Peer-to-Peer
        </Link>
      </div>
      <div></div>
    </div>
  );
}
