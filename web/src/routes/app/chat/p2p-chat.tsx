import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../components/app/Header";

export const Route = createFileRoute("/app/chat/p2p-chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header section="p2p-chat" />
    </div>
  );
}
