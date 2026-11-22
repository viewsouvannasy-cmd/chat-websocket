import { useRef, useEffect } from "react";

import type { Message } from "../../../types/response";

interface ChatSectionProps {
  currentUserId: number | undefined;
  data: Message[];
}

export function ChatSection({ currentUserId, data }: ChatSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [data]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center px-4 pb-24">
        <div
          ref={containerRef}
          className="flex w-full flex-1 justify-center overflow-y-auto overscroll-contain"
        >
          <div className="flex w-full max-w-140 flex-col gap-5 transition-all">
            {data?.map((msg, index) => {
              const isCurrentUser = msg.user_id === currentUserId;
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
    </>
  );
}
