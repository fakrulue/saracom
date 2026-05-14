import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/")({
  component: () => <Navigate to="/collections/$handle" params={{ handle: "all" }} />,
});
