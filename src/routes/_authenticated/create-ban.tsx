import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import CreateBanPage from "@/components/CreateBanPage";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

// Starts with every venue selected, for banning someone from everywhere at once
export const Route = createFileRoute("/_authenticated/create-ban")({
  loader: ({ context }) => context.queryClient.ensureQueryData(venuesQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const venues = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <CreateBanPage
      defaultVenueIds={venues.map((venue) => venue.id)}
      subheading={"All venues are selected, so this bans them from everywhere"}
      onCreated={() => navigate({ to: "/", search: { tab: "blanket-bans" } })}
    />
  );
}
