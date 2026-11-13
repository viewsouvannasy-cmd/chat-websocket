import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center p-4">
      <form className="flex w-full max-w-110 flex-col items-center gap-7">
        <h2 className="mb-5 text-2xl font-medium">LOGIN TO CHAT.</h2>
        <div className="flex w-full flex-col gap-1">
          <label>USER NAME</label>
          <input className="border p-2" required />
        </div>
        <div className="flex w-full flex-col gap-1">
          <label>PASSWORD</label>
          <input className="border p-2" required />
        </div>
        <button className="w-full cursor-pointer bg-black p-3 text-white">
          Continue
        </button>
      </form>
    </div>
  );
}
