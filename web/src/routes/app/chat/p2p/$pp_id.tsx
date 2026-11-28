import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrow } from "../../../../components/icon/IconArrow";
import { InputMessage } from "../../../../components/app/chat/InputMessage";
import { useEffect, useMemo, useState } from "react";
import { ChatSection } from "../../../../components/app/chat/ChatSection";

import {
  useGetP2PChat,
  useSendMessageP2P,
} from "../../../../api/chat/p2p-chat/p2p-chat";
import type { Message } from "../../../../types/response";
import { socket } from "../../../../main";

export const Route = createFileRoute("/app/chat/p2p/$pp_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputMessage, setInputMessage] = useState("");
  const { pp_id } = Route.useParams();
  const { data: p2pData } = useGetP2PChat(Number(pp_id));

  const [locaMessage, setLocalMessage] = useState<Message[]>([]);

  const p2pChatData = useMemo(
    () => [...(p2pData?.data[0].chats ?? []), ...locaMessage],
    [p2pData, locaMessage],
  );

  const { mutate } = useSendMessageP2P();

  const handleSendMessage = () => {
    if (inputMessage.length === 0) return;

    if (!p2pData) return;

    setLocalMessage((prev) => [
      ...prev,
      {
        user_id: p2pData.data[0].user_id,
        user_name: "",
        content: inputMessage,
        create_at: new Date(),
      },
    ]);
    setInputMessage("");

    mutate({
      pp_id: Number(pp_id),
      content: inputMessage,
    });
  };

  useEffect(() => {
    const handleEvent = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.user_id === p2pData?.data[0].user_id) {
        return;
      }

      setLocalMessage((prev) => [...prev, data]);
    };

    socket.addEventListener("message", handleEvent);

    return () => socket.removeEventListener("message", handleEvent);
  }, [p2pData]);

  useEffect(() => {
    const join = () =>
      socket.send(
        JSON.stringify({ type: "join-room", roomId: `p2p:${pp_id}` }),
      );

    join();

    return () => {
      socket.send(
        JSON.stringify({ type: "leave-room", roomId: `p2p:${pp_id}` }),
      );
      socket.removeEventListener("open", join);
    };
  }, [pp_id]);

  return (
    <div className="flex h-dvh w-dvw flex-col">
      <div className="flex w-full justify-center p-3">
        <div className="flex w-full max-w-140 gap-2">
          <Link
            to="/app/chat/p2p"
            className="flex h-7.5 w-7.5 shrink-0 -rotate-90 items-center justify-center rounded-2xl bg-black"
          >
            <IconArrow color="white" strokeWidth={1.5} size={18} />
          </Link>
          <h1 className="text-xl font-semibold">
            {p2pData?.data[0].opposite_user_name}
          </h1>
        </div>
      </div>

      <ChatSection
        currentUserId={p2pData?.data[0].user_id}
        data={p2pChatData}
      />

      <InputMessage
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        func={handleSendMessage}
      />
    </div>
  );
}
