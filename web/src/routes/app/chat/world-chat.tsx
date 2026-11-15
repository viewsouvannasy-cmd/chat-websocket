import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../components/app/Header";
import { ChatSection } from "../../../components/app/chat/ChatSection";

export const Route = createFileRoute("/app/chat/world-chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header section="world-chat" />
      <ChatSection />
    </>
  );
}
