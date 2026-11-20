import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../../components/app/Header";
import { useState } from "react";

import SipnnerLoad from "../../../../components/load-state/SipnnerLoad";
import {
  useGetGroupList,
  useCreateGroupChat,
} from "../../../../api/chat/group-chat/group-chat";

export const Route = createFileRoute("/app/chat/group/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [inputName, setInputName] = useState("");

  const { data } = useGetGroupList();

  const { mutate, isPending } = useCreateGroupChat();

  const handleCreateGroupChat = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { group_name: inputName },
      { onSuccess: () => setIsOpenPopup(false) },
    );
  };

  return (
    <>
      <div className="flex h-dvh w-dvw flex-col gap-4">
        <Header section="group-chat" />

        <div className="flex w-full justify-center p-2">
          <div className="flex w-full max-w-140 flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">My Group</p>
              <button
                onClick={() => setIsOpenPopup(true)}
                className="cursor-pointer rounded-full bg-black px-3 py-1 text-sm text-white"
              >
                + Group
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data?.data.map((item) => {
                return (
                  <div
                    key={item.g_id}
                    className="cursor-pointer border border-gray-400 p-3 transition-all duration-200 hover:shadow-lg hover:shadow-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <h1 className="font-medium">{item.group_name}</h1>
                      {item.is_owner && (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                          <p className="-mt-0.5 cursor-pointer text-xs text-white">
                            x
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      members: {item.members.join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* popup */}
      {isOpenPopup && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/30 p-4">
          <form
            onSubmit={handleCreateGroupChat}
            className="flex w-full max-w-100 flex-col gap-3 rounded-2xl bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">Create new group</h1>
              <button
                onClick={() => setIsOpenPopup(false)}
                type="button"
                className="cursor-pointer text-xs hover:underline"
              >
                close
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm">GROUP NAME</p>
              <input
                placeholder="my group name is..."
                className="rounded-full bg-gray-200 px-4 py-2"
                onChange={(e) => setInputName(e.target.value)}
                value={inputName}
                required
              />
            </div>
            <button
              type="submit"
              className="flex cursor-pointer justify-center rounded-full bg-black p-2.5 text-white"
              disabled={isPending}
            >
              {isPending ? <SipnnerLoad /> : "+ Creaet"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
