import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { bannedPeopleAtVenueQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { venueQueryOptions } from "@/api-requests/venues/venues.queries";
import BannedPeopleSearch from "@/components/BannedPeopleSearch";
import CreateButton from "@/components/CreateButton";
import Dialog from "@/components/Dialog";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import VenueManagersEdit from "@/components/VenueManagersEdit";
import { Role } from "@/types/Role";
import { Button, HStack, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LuUsers } from "react-icons/lu";

export const Route = createFileRoute("/_authenticated/venues/$venueId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();
  const { data: venue, isError: isVenueError } = useQuery(venueQueryOptions(venueId));
  const { data: user } = useQuery(userDetailsQueryOptions);
  // Comes back with each person's bans already narrowed to this venue
  const { data: peopleAtVenue, isPending, isError } = useQuery(
    bannedPeopleAtVenueQueryOptions(venueId),
  );
  const [isManagersDialogOpen, setIsManagersDialogOpen] = useState<boolean>(false);

  const managerNames = venue?.managers.map((m) => m.staff.name).join(", ");
  const dutyManagerNames = venue?.dutyManagers.map((m) => m.staff.name).join(", ");

  // Also covers managers opening a venue they aren't assigned to, which the API reports as missing
  if (isVenueError) {
    return (
      <LayoutCreate
        heading={"Venue not found"}
        subheading={"This venue doesn't exist or you don't have access to it"}
        returnArrow
      >
        <></>
      </LayoutCreate>
    );
  }

  return (
    <LayoutCreate
      heading={venue?.name}
      subheading={venue ? "People banned from this venue" : undefined}
      returnArrow
    >
      <Stacker direction={"column"}>
        {venue ? (
          <Stacker direction={"column"} gap={1}>
            <Text color="fg.muted">Venue managers: {managerNames || "None"}</Text>
            <Text color="fg.muted">Duty managers: {dutyManagerNames || "None"}</Text>
          </Stacker>
        ) : (
          <SkeletonText noOfLines={2} maxW="sm" />
        )}

        <HStack gap={2} wrap="wrap">
          <Skeleton loading={!venue} rounded="l2">
            <CreateButton
              text="Create New Ban"
              onClick={async () =>
                await navigate({ to: "/venues/$venueId/create-ban", params: { venueId } })
              }
            />
          </Skeleton>

          {user?.role === Role.ADMIN && (
            <Skeleton loading={!venue} rounded="l2">
              <Button
                variant="outline"
                onClick={() => setIsManagersDialogOpen(true)}
                disabled={!venue}
              >
                Edit Managers <LuUsers />
              </Button>
            </Skeleton>
          )}
        </HStack>

        <BannedPeopleSearch
          people={peopleAtVenue ?? []}
          // The whole page loads together rather than the list showing before the venue
          isPending={isPending || !venue}
          isError={isError}
          emptyText="No one has been banned from this venue"
        />
      </Stacker>

      <Dialog
        isOpen={isManagersDialogOpen}
        setIsOpen={setIsManagersDialogOpen}
        title={`Managers For ${venue?.name ?? ""}`}
        body={
          venue ? (
            <VenueManagersEdit
              key={String(isManagersDialogOpen)}
              venue={venue}
              closeDialog={() => setIsManagersDialogOpen(false)}
            />
          ) : (
            <></>
          )
        }
      />
    </LayoutCreate>
  );
}
