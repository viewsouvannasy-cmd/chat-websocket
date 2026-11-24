import { IconArrow } from "../../icon/IconArrow";

interface InputMessage {
  inputMessage: string;
  setInputMessage: (param: string) => void;
  func: () => void;
}

export function InputMessage({
  inputMessage,
  setInputMessage,
  func,
}: InputMessage) {
  return (
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
              e.preventDefault();
              func();
            }
          }}

          rows={1}
        />

        <button
          onClick={func}
          className={`rounded-full p-1 transition-colors duration-100 ${inputMessage.length > 0 ? "bg-black" : "bg-gray-300"}`}
        >
          <IconArrow color="white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
