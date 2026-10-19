import Stacker from "../Stacker";
import CreateButton from "../CreateButton";
import { useNavigate } from "@tanstack/react-router";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";
import { useQuery } from "@tanstack/react-query";
import { Text, SimpleGrid } from "@chakra-ui/react";
import VenueCard from "../VenueCard";
import { CardGridSkeleton, VenueCardSkeleton } from "../Skeletons";
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
            return <CardGridSkeleton card={<VenueCardSkeleton />} />;
        }

        if (isError) {
            return <Text>Couldn't load venues</Text>;
        }

        if (venues.length === 0) {
            return <Text>No venues have been added</Text>;
        }

        if (filteredVenues.length === 0) {
            return <Text>No venues match "{search.trim()}"</Text>;
        }

        return (
            <SimpleGrid columns={[2, null, null, 4]} columnGap={4} rowGap={8} w="full">
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
            {user?.role === Role.ADMIN && (
                <CreateButton
                    text="Create New Venue"
                    onClick={async () => await navigate({ to: "/create-venue" })}
                />
            )}

            <FieldInput
                label="Search"
                value={search}
                onChange={setSearch}
                placeholder="Search by venue name"
            />

            {renderVenues()}
        </Stacker>
    );
};

export default VenuesTab;
