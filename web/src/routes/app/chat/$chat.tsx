import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../../../components/app/Header";
import { InputMessgae } from "../../../components/app/InputMessage";

export const Route = createFileRoute("/app/chat/$chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />

      <InputMessgae />
    </div>
  );
}
