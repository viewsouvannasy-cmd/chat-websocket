import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../components/app/Header";
import { ChatSection } from "../../../components/app/chat/ChatSection";
import { useEffect, useMemo, useState } from "react";
import { socket } from "../../../main";
import { useGetUserData } from "../../../api/user/user";
import {
  useGetWorldChat,
  useSendWorldChat,
} from "../../../api/chat/world-chat/world-chat";
import { InputMessage } from "../../../components/app/chat/InputMessage";
import type { Message } from "../../../types/response";

export const Route = createFileRoute("/app/chat/world-chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputMessage, setInputMessage] = useState("");

  const { data: userData } = useGetUserData();
  const { data: chatData } = useGetWorldChat();
  const [localMessage, setLocalMessage] = useState<Message[]>([]);

  const dataChatList = useMemo(
    () => [...(chatData?.data ?? []), ...localMessage],
    [chatData, localMessage],
  );

  const { mutate } = useSendWorldChat();

  const handleSendWorldChat = () => {
    if (!inputMessage.trim()) return;

    const currentUser = userData?.data[0];

    if (!currentUser) {
      return;
    }

    mutate({
      content: inputMessage,
    });
    setLocalMessage((prev) => [
      ...prev,
      {
        user_id: currentUser.user_id,
        content: inputMessage,
        create_at: currentUser.create_at,
        user_name: currentUser.user_name,
      },
    ]);
    setInputMessage("");
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.user_id === userData?.data[0].user_id) {
        console.log("log");
        return;
      }

      const update = [...localMessage, { ...data }];
      setLocalMessage(update);
    };
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [userData, localMessage]);

  const currentUserId = userData?.data[0].user_id;

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">
      <Header section="world-chat" />

      <ChatSection currentUserId={currentUserId} data={dataChatList} />

      <InputMessage
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        func={handleSendWorldChat}
      />
    </div>
  );
}
