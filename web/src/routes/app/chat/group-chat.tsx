import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../components/app/Header";

export const Route = createFileRoute("/app/chat/group-chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header section="group-chat" />
    </div>
  );
}
