import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_employee/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_employee/dashboard"!</div>
}
