import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrow } from "../../../../components/icon/IconArrow";
import { useMemo, useState } from "react";
import { useEffect } from "react";

import { PopupSearchUser } from "../../../../components/popup/PopupSearchUser";
import { InputMessage } from "../../../../components/app/chat/InputMessage";
import {
  useAddMember,
  useGetGroupChat,
  useGetGroupDetail,
  useSendMessageGroup,
} from "../../../../api/chat/group-chat/group-chat";
import { ChatSection } from "../../../../components/app/chat/ChatSection";
import { socket } from "../../../../main";
import type { Message } from "../../../../types/response";
import { useGetUserData } from "../../../../api/user/user";

export const Route = createFileRoute("/app/chat/group/$group_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { group_id } = Route.useParams();

  const [inputMessage, setInputMessage] = useState("");

  const { mutate } = useSendMessageGroup();

  const [localMessage, setLocalMessage] = useState<Message[]>([]);

  const { data: groupDetail } = useGetGroupDetail(Number(group_id));
  const { data: groupChatData } = useGetGroupChat(Number(group_id));
  const { data: userData } = useGetUserData();

  const dataGroupChatList = useMemo(
    () => [...(groupChatData?.data[0].chats ?? []), ...localMessage],
    [groupChatData, localMessage],
  );

  const handleSendMessageGroup = () => {
    if (inputMessage.length === 0) {
      return;
    }

    if (!userData || !groupChatData) {
      return;
    }

    setLocalMessage((prev) => [
      ...prev,
      {
        user_id: userData.data[0].user_id,
        content: inputMessage,
        create_at: new Date(),
        user_name: userData.data[0].user_name,
      },
    ]);

    mutate({
      g_id: Number(group_id),
      gm_id: groupChatData?.data[0].user_member_id,
      content: inputMessage,
    });

    setInputMessage("");
  };

  const { mutate: addMember, isPending } = useAddMember();

  const handleAddMember = (user_id: number) => {
    addMember(
      {
        g_id: Number(group_id),
        user_id_to_member: user_id,
      },
      { onSuccess: () => setIsOpenPopup(false) },
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.user_id === userData?.data[0].user_id) {
        return;
      }

      setLocalMessage((prev) => [...prev, data]);
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [userData]);

  useEffect(() => {
    const join = () =>
      socket.send(
        JSON.stringify({ type: "join-room", roomId: `group:${group_id}` }),
      );

    join();

    return () => {
      socket.send(JSON.stringify({ type: "leave-room", roomId: "world-chat" }));
      socket.removeEventListener("open", join);
    };
  }, [group_id]);

  return (
    <>
      <div className="flex h-dvh w-dvw flex-col">
        <div className="flex items-center justify-between gap-2 p-3">
          <Link
            to="/app/chat/group"
            className="flex h-7.5 w-7.5 shrink-0 -rotate-90 items-center justify-center rounded-2xl bg-black"
          >
            <IconArrow color="white" strokeWidth={1.5} size={18} />
          </Link>
          <div className="w-full max-w-125">
            <p className="-mb-1 font-semibold">
              {groupDetail?.data?.[0].group_name}
            </p>
            <span className="text-sm text-gray-500">
              members:{" "}
              {groupDetail?.data.map((item) => item.user_name).join(" ,")}
            </span>
          </div>
          <button
            onClick={() => setIsOpenPopup(true)}
            className="flex cursor-pointer items-center gap-2 border p-2 text-sm hover:bg-black hover:text-white"
          >
            <span>+</span>
            member
          </button>
        </div>

        <ChatSection
          currentUserId={userData?.data[0].user_id}
          data={dataGroupChatList}
        />

        <InputMessage
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          func={handleSendMessageGroup}
        />
      </div>

      {isOpenPopup && (
        <PopupSearchUser
          setIsOpenPopup={setIsOpenPopup}
          group_id={Number(group_id)}
          func={handleAddMember}
          isPending={isPending}
        />
      )}
    </>
  );
}
