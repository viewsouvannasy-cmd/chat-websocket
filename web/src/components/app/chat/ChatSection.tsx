// const data = [
//   {
//     wc_id: 1,
//     user_id: 1,
//     content: "Welcome to the World Chat! 🌍",
//     create_at: "2026-11-14T07:50:02.114Z",
//     user_name: "Alice",
//   },
//   {
//     wc_id: 2,
//     user_id: 4,
//     content: "Hi",
//     create_at: "2026-11-14T07:54:19.825Z",
//     user_name: "View",
//   },
//   {
//     wc_id: 3,
//     user_id: 2,
//     content: "สวัสดีครับทุกคน",
//     create_at: "2026-11-14T07:55:41.302Z",
//     user_name: "Somchai",
//   },
//   {
//     wc_id: 4,
//     user_id: 3,
//     content: "こんにちは！Hello from Tokyo 🇯🇵",
//     create_at: "2026-11-14T07:56:10.570Z",
//     user_name: "Kenji",
//   },
//   {
//     wc_id: 5,
//     user_id: 5,
//     content: "Hola! Anyone here from Spain or Latin America?",
//     create_at: "2026-11-14T07:57:33.018Z",
//     user_name: "Maria",
//   },
//   {
//     wc_id: 6,
//     user_id: 6,
//     content: "Hey Maria! I'm from Brazil 🇧🇷 Olá!",
//     create_at: "2026-11-14T07:58:05.447Z",
//     user_name: "Lucas",
//   },
//   {
//     wc_id: 7,
//     user_id: 4,
//     content: "I'm from Laos 🇱🇦 Nice to meet you all!",
//     create_at: "2026-11-14T07:59:27.889Z",
//     user_name: "View",
//   },
//   {
//     wc_id: 8,
//     user_id: 7,
//     content: "مرحبا بالجميع! Good evening from Dubai 🌙",
//     create_at: "2026-11-14T08:01:12.236Z",
//     user_name: "Aisha",
//   },
//   {
//     wc_id: 9,
//     user_id: 8,
//     content: "大家好！It's already night here in Shanghai.",
//     create_at: "2026-11-14T08:02:48.653Z",
//     user_name: "Chen",
//   },
//   {
//     wc_id: 10,
//     user_id: 1,
//     content: "Love how many time zones we have in one chat 😄",
//     create_at: "2026-11-14T08:04:15.091Z",
//     user_name: "Alice",
//   },
//   {
//     wc_id: 11,
//     user_id: 2,
//     content: "What's the weather like where you are?",
//     create_at: "2026-11-14T08:05:39.774Z",
//     user_name: "Somchai",
//   },
//   {
//     wc_id: 12,
//     user_id: 3,
//     content: "Autumn here, cool and clear. Leaves are turning red 🍁",
//     create_at: "2026-11-14T08:06:52.320Z",
//     user_name: "Kenji",
//   },
//   {
//     wc_id: 13,
//     user_id: 6,
//     content: "Summer is coming in Brazil, it's already 30°C ☀️",
//     create_at: "2026-11-14T08:08:21.945Z",
//     user_name: "Lucas",
//   },
//   {
//     wc_id: 14,
//     user_id: 5,
//     content: "Jealous! It's raining in Madrid today 🌧️",
//     create_at: "2026-11-14T08:09:44.508Z",
//     user_name: "Maria",
//   },
//   {
//     wc_id: 15,
//     user_id: 4,
//     content: "Warm and sunny in Vientiane, perfect weather ☀️",
//     create_at: "2026-11-14T08:11:03.172Z",
//     user_name: "View",
//   },
// ];

import { useMemo, useState, useRef, useEffect } from "react";

import { IconArrow } from "../../icon/IconArrow";
import { useGetUserData } from "../../../api/user/user";
import {
  useGetWorldChat,
  useSendWorldChat,
} from "../../../api/chat/world-chat/world-chat";

export function ChatSection() {
  const [inputMessage, setInputMessage] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetUserData();
  const { data: chatData } = useGetWorldChat();
  const [localMessage, setLocalMessage] = useState<
    {
      ws_id: number;
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
                  key={msg.ws_id}
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
