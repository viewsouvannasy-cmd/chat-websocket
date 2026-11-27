import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/chat/p2p/$pp_id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
