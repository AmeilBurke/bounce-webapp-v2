import CreateBanPage from "@/components/CreateBanPage";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/venues/$venueId_/create-ban")({
  component: RouteComponent,
});

function RouteComponent() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <CreateBanPage
      defaultVenueIds={[venueId]}
      subheading={"Fill out the details below to ban someone"}
      onCreated={() => navigate({ to: "/venues/$venueId", params: { venueId } })}
    />
  );
}
