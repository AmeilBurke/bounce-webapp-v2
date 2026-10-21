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
import Panel from "@/components/Panel";
import { Button, HStack, SimpleGrid, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
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
        <SimpleGrid columns={[1, 2]} gap={3} w="full" maxW="3xl">
          {[
            { label: "Venue managers", names: managerNames },
            { label: "Duty managers", names: dutyManagerNames },
          ].map(({ label, names }) => (
            <Panel key={label} p={4}>
              <Text color="fg.muted" fontSize="sm">
                {label}
              </Text>
              {venue ? (
                <Text fontWeight="semibold" mt={1} overflowWrap="anywhere">
                  {names || "None"}
                </Text>
              ) : (
                <SkeletonText noOfLines={1} mt={2} />
              )}
            </Panel>
          ))}
        </SimpleGrid>

        <HStack gap={2} wrap="wrap">
          <Skeleton loading={!venue} rounded="l2">
            <CreateButton
              text="New Ban"
              onClick={async () =>
                await navigate({ to: "/venues/$venueId/create-ban", params: { venueId } })
              }
            />
          </Skeleton>

          {user?.role === Role.ADMIN && (
            <Skeleton loading={!venue} rounded="l2">
              <Button
                size="sm"
                variant="outline"
                bg="bg.panel"
                onClick={() => setIsManagersDialogOpen(true)}
                disabled={!venue}
              >
                <LuUsers /> Edit Managers
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
