import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/chat/group/$group_id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/chat/group/$group_id"!</div>
}
