import { createFileRoute, Link } from "@tanstack/react-router";
import { IconArrow } from "../../../../components/icon/IconArrow";
import { useState } from "react";

import { PopupSearchUser } from "../../../../components/popup/PopupSearchUser";
export const Route = createFileRoute("/app/chat/group/$group_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { group_id } = Route.useParams();

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
          <div className="w-full max-w-100">
            <p className="-mb-1 font-semibold">Group name</p>
            <span className="text-sm text-gray-500">members: view</span>
          </div>
          <button
            onClick={() => setIsOpenPopup(true)}
            className="flex cursor-pointer items-center gap-2 border p-2 text-sm hover:bg-black hover:text-white"
          >
            <span>+</span>
            member
          </button>
        </div>
      </div>

      {isOpenPopup && (
        <PopupSearchUser
          setIsOpenPopup={setIsOpenPopup}
          group_id={Number(group_id)}
        />
      )}
    </>
  );
}
