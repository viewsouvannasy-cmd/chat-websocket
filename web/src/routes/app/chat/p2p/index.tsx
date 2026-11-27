import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../../components/app/Header";
import { useState } from "react";
import { PopupSearchUser } from "../../../../components/popup/PopupSearchUser";
import { useGetP2PList } from "../../../../api/chat/p2p-chat/p2p-chat";

export const Route = createFileRoute("/app/chat/p2p/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const { data } = useGetP2PList();

  const p2pList = data?.data;

  return (
    <>
      <div className="flex h-dvh w-dvw flex-col gap-4">
        <Header section="p2p-chat" />

        <div className="flex w-full flex-col items-center gap-3 p-2">
          <div className="flex w-full max-w-140 items-center justify-between">
            <p className="text-lg font-semibold">My Firend</p>
            <button
              onClick={() => setIsOpenPopup(true)}
              className="cursor-pointer rounded-full bg-black px-3 py-1 text-sm font-medium text-white"
            >
              + Add Firend
            </button>
          </div>

          <div className="flex w-full max-w-140 flex-col gap-3">
            {p2pList?.map((item) => {
              return (
                <div className="w-full cursor-pointer border border-gray-400 p-3 hover:shadow-lg hover:shadow-gray-200">
                  <p className="font-medium">{item[item?.opposite_user]}</p>
                  <span className="text-sm text-gray-500">
                    <span className="font-medium">
                      {item[item?.user_create_content]}
                    </span>
                    : {item.last_content}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isOpenPopup && (
        <PopupSearchUser
          setIsOpenPopup={setIsOpenPopup}
          group_id={0}
          func={() => console.log("d")}
          isPending={false}
        />
      )}
    </>
  );
}
