import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { bannedPeopleQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { venueQueryOptions } from "@/api-requests/venues/venues.queries";
import BannedPeopleSearch from "@/components/BannedPeopleSearch";
import CreateButton from "@/components/CreateButton";
import Dialog from "@/components/Dialog";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import VenueManagersEdit from "@/components/VenueManagersEdit";
import { Role } from "@/types/Role";
import { isBanAtVenue } from "@/utils/bans";
import { Button, HStack, SkeletonText, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LuUsers } from "react-icons/lu";

export const Route = createFileRoute("/_authenticated/venues/$venueId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { venueId } = Route.useParams();
  const navigate = useNavigate();
  const { data: venue, isError: isVenueError } = useQuery(venueQueryOptions(venueId));
  const { data: user } = useQuery(userDetailsQueryOptions);
  const { data: bannedPeople, isPending, isError } = useQuery(bannedPeopleQueryOptions);
  const [isManagersDialogOpen, setIsManagersDialogOpen] = useState<boolean>(false);

  // Only approved bans at this venue count towards the list and its statuses
  const peopleAtVenue = useMemo(
    () =>
      (bannedPeople ?? [])
        .map((person) => ({
          ...person,
          bans: person.bans.filter((ban) => !ban.isPending && isBanAtVenue(ban, venueId)),
        }))
        .filter((person) => person.bans.length > 0),
    [bannedPeople, venueId],
  );

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
      heading={venue?.name ?? "Venue"}
      subheading={"People banned from this venue"}
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
          <CreateButton
            text="Create New Ban"
            onClick={async () =>
              await navigate({ to: "/venues/$venueId/create-ban", params: { venueId } })
            }
          />

          {user?.role === Role.ADMIN && venue && (
            <Button variant="outline" onClick={() => setIsManagersDialogOpen(true)}>
              Edit Managers <LuUsers />
            </Button>
          )}
        </HStack>

        <BannedPeopleSearch
          people={peopleAtVenue}
          isPending={isPending}
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
