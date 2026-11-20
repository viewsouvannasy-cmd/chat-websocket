import { useMemo, useState, useRef, useEffect } from "react";

import { useGetUserData } from "../../../api/user/user";
import {
  useGetWorldChat,
  useSendWorldChat,
} from "../../../api/chat/world-chat/world-chat";
import { InputMessage } from "./InputMessage";

import { socket } from "../../../main";

export function ChatSection() {
  const [inputMessage, setInputMessage] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetUserData();
  const { data: chatData } = useGetWorldChat();
  const [localMessage, setLocalMessage] = useState<
    {
      user_id: number;
      content: string;
      create_at: Date;
      user_name: string;
    }[]
  >([]);

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
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [dataChatList]);

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

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center px-4 pb-24">
        <div
          ref={containerRef}
          className="flex w-full flex-1 justify-center overflow-y-auto overscroll-contain"
        >
          <div className="flex w-full max-w-140 flex-col gap-5 transition-all">
            {dataChatList?.map((msg, index) => {
              const isCurrentUser = msg.user_id === userData?.data[0].user_id;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isCurrentUser ? "items-end self-end" : "items-start self-start"}`}
                >
                  <span className="text-sm font-medium">
                    {isCurrentUser ? "You" : msg.user_name}
                  </span>
                  <div className="border border-gray-400 p-3">
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <InputMessage
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        func={handleSendWorldChat}
      />
    </>
  );
}
