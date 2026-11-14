import { Link, useParams } from "@tanstack/react-router";

export function Header() {
  const { chat } = useParams({ from: "/app/chat/$chat" });

  return (
    <div className="fixed flex w-full items-center justify-center gap-3 p-2">
      <Link
        to="/app/chat/$chat"
        params={{ chat: "world-chat" }}
        className={`cursor-pointer px-3 py-1 text-sm font-semibold ${chat === "world-chat" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
      >
        World
      </Link>
      <Link
        to="/app/chat/$chat"
        params={{ chat: "group-chat" }}
        className={`cursor-pointer px-3 py-1 text-sm font-semibold ${chat === "group-chat" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
      >
        Group
      </Link>
      <Link
        to="/app/chat/$chat"
        params={{ chat: "p2p" }}

        className={`cursor-pointer px-3 py-1 text-sm font-semibold ${chat === "p2p" ? "bg-black text-white" : "bg-transparent text-gray-400"} rounded-full`}
      >
        Peer-to-Peer
      </Link>
    </div>
  );
}
