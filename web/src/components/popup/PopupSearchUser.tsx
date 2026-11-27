import { useState } from "react";
import { useDebounce } from "../../hook/useDebounce";
import SipnnerLoad from "../load-state/SipnnerLoad";
import { searchUserForGroup } from "../../api/chat/group-chat/group-chat-func";
import { useQuery } from "@tanstack/react-query";

interface PopupSearchUserProps {
  setIsOpenPopup: (param: boolean) => void;
  group_id: number;
  func: (user_id: number) => void;
  isPending: boolean;
}

export function PopupSearchUser({
  setIsOpenPopup,
  group_id,
  func,
  isPending,
}: PopupSearchUserProps) {
  const [inputSearch, setInputSearch] = useState("");

  const debouncedSearch = useDebounce(inputSearch, 500);

  const { data: resultSearch = [], isFetching } = useQuery({
    queryKey: ["search-user", debouncedSearch],
    queryFn: () =>
      searchUserForGroup(true, { search: debouncedSearch, group_id }),
    enabled: debouncedSearch.length > 0,
    select: (res) => res.data,
  });

  const isDebouncing = inputSearch !== debouncedSearch;
  const isLoading = inputSearch.length > 0 && (isDebouncing || isFetching);
  const results = inputSearch.length === 0 ? [] : resultSearch;

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/30 p-3">
      <div className="flex h-[50%] min-h-80 w-full max-w-100 flex-col gap-2 rounded-2xl bg-white p-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Search User</p>
          <button
            onClick={() => setIsOpenPopup(false)}
            className="cursor-pointer text-sm underline"
          >
            close
          </button>
        </div>
        <input
          placeholder="search to add member"
          className="w-full rounded-full bg-gray-200 px-3 py-2 text-sm"
          onChange={(e) => {
            setInputSearch(e.target.value);
          }}
          value={inputSearch}
        />

        {results?.length > 0 ? (
          <div className="flex flex-1 flex-col overflow-scroll">
            {results.map((item) => {
              return (
                <div
                  key={item.user_id}
                  className="flex w-full items-center justify-between border-b border-gray-400 p-2"
                >
                  <p className="font-medium">{item.user_name}</p>
                  <button
                    disabled={isPending}
                    onClick={() => func(item.user_id)}
                    className="cursor-pointer rounded-full bg-black px-2 py-0.5 text-sm text-white hover:opacity-60"
                  >
                    {isPending ? <SipnnerLoad size={4} /> : "+ add"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            {!isLoading && inputSearch.length === 0 && (
              <p className="text-gray-400">try to type something</p>
            )}
            {inputSearch.length > 0 && isLoading && (
              <SipnnerLoad color="black" />
            )}
            {!isLoading && inputSearch.length > 0 && (
              <p className="text-gray-400">No result.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
