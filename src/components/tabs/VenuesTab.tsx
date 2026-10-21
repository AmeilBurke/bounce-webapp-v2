import Stacker from "../Stacker";
import CreateButton from "../CreateButton";
import { useNavigate } from "@tanstack/react-router";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import { useQuery } from "@tanstack/react-query";
import { SimpleGrid } from "@chakra-ui/react";
import VenueCard from "../VenueCard";
import { CardGridSkeleton, VenueCardSkeleton } from "../Skeletons";
import EmptyMessage from "../EmptyMessage";
import SectionLabel from "../SectionLabel";
import TabHeader from "../TabHeader";
import FieldInput from "../FieldInput";
import { useMemo, useState } from "react";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";

const VenuesTab = () => {
    const navigate = useNavigate();
    const { data: venues, isPending, isError } = useQuery(venuesQueryOptions);
    const { data: user } = useQuery(userDetailsQueryOptions);
    const [search, setSearch] = useState("");

    const filteredVenues = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return venues ?? [];
        return (venues ?? []).filter((venue) => venue.name.toLowerCase().includes(term));
    }, [venues, search]);

    const renderVenues = () => {
        if (isPending) {
            return <CardGridSkeleton columns={[1, 2, null, 3]} count={6} card={<VenueCardSkeleton />} />;
        }

        if (isError) {
            return <EmptyMessage kind="error" title="Couldn't load venues" />;
        }

        if (venues.length === 0) {
            return <EmptyMessage title="No venues have been added" />;
        }

        if (filteredVenues.length === 0) {
            return <EmptyMessage kind="search" title={`No venues match "${search.trim()}"`} />;
        }

        return (
            <SimpleGrid columns={[1, 2, null, 3]} gap={3} w="full">
                {filteredVenues.map((venue) => (
                    <VenueCard
                        key={venue.id}
                        venue={venue}
                        onOpen={() =>
                            navigate({ to: "/venues/$venueId", params: { venueId: venue.id } })
                        }
                    />
                ))}
            </SimpleGrid>
        );
    };

    return (
        <Stacker direction={"column"}>
            <TabHeader
                title="Venues"
                description="Open a venue to see who's banned from it"
                aside={
                    user?.role === Role.ADMIN && (
                        <CreateButton
                            text="New Venue"
                            onClick={async () => await navigate({ to: "/create-venue" })}
                        />
                    )
                }
            />

            <Stacker direction={"column"} gap={6}>
                <FieldInput
                    label="Search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by venue name"
                    isSearch
                />

                <Stacker direction={"column"} gap={3}>
                    <SectionLabel>
                        {venues ? `${filteredVenues.length} ${filteredVenues.length === 1 ? "venue" : "venues"}` : "Venues"}
                    </SectionLabel>
                    {renderVenues()}
                </Stacker>
            </Stacker>
        </Stacker>
    );
};

export default VenuesTab;
