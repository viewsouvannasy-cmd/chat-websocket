import { useMemo, useState, useRef, useEffect } from "react";

import { IconArrow } from "../../icon/IconArrow";
import { useGetUserData } from "../../../api/user/user";
import {
  useGetWorldChat,
  useSendWorldChat,
} from "../../../api/chat/world-chat/world-chat";
import { connectWebSocketServer } from "../../../api/ws/ws";

export function ChatSection() {
  const [inputMessage, setInputMessage] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetUserData();
  const { data: chatData } = useGetWorldChat();
  const [localMessage, setLocalMessage] = useState<
    {
      wc_id: number;
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

    mutate(
      {
        content: inputMessage,
      },
      {
        onSuccess: (data) => {
          setLocalMessage((prev) => [...prev, data.data[0]]);
        },
      },
    );
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
    const socket = connectWebSocketServer();

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.user_id === userData?.data[0].user_id) return;
      const update = [...localMessage, { ...data }];
      setLocalMessage(update);
    });

    return () => {
      socket.removeEventListener("message", (event) => console.log(event.data));
      socket.close();
    };
  }, [localMessage, userData]);

  console.log(localMessage);

  return (
    <>
      <div className="h-dvh w-dvw px-4 pt-11">
        <div
          ref={containerRef}
          className="flex h-[86%] justify-center overflow-y-auto"
        >
          <div className="flex max-w-140 flex-1 flex-col gap-5 transition-all">
            {dataChatList?.map((msg) => {
              const isCurrentUser = msg.user_id === userData?.data[0].user_id;
              return (
                <div
                  key={msg.wc_id}
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

      <div className="fixed bottom-0 flex w-full items-center justify-center bg-white p-3">
        <div className="flex w-full max-w-140 items-center justify-between gap-2 rounded-full border border-gray-200 p-4 px-5 shadow-lg shadow-gray-300">
          <textarea
            className="flex-1 resize-none outline-none"
            placeholder="type message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // ยกเลิกการขึ้นบรรทัดใหม่
                handleSendWorldChat();
              }
            }}

            rows={1}
          />

          <button
            onClick={handleSendWorldChat}
            className={`rounded-full p-1 transition-colors duration-100 ${inputMessage.length > 0 ? "bg-black" : "bg-gray-300"}`}
          >
            <IconArrow color="white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </>
  );
}
