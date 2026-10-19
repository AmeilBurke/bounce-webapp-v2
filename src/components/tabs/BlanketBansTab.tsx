import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import BannedPeopleSearch from "../BannedPeopleSearch";
import CreateButton from "../CreateButton";
import Stacker from "../Stacker";
import { bannedPeopleQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { venueIdsQueryOptions } from "@/api-requests/venues/venues.queries";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";
import { hasBlanketBan } from "@/utils/bans";

const BlanketBansTab = () => {
    const navigate = useNavigate();
    const { data: user } = useQuery(userDetailsQueryOptions);
    const bannedPeopleQuery = useQuery(bannedPeopleQueryOptions);
    // All venue ids, since managers' own venue list only holds the venues they're assigned to
    const venueIdsQuery = useQuery(venueIdsQueryOptions);

    const blanketBanned = useMemo(() => {
        const venueIds = venueIdsQuery.data ?? [];

        return (bannedPeopleQuery.data ?? [])
            .map((person) => ({
                ...person,
                bans: person.bans.filter((ban) => !ban.isPending),
            }))
            .filter((person) => hasBlanketBan(person.bans, venueIds));
    }, [bannedPeopleQuery.data, venueIdsQuery.data]);

    return (
        <Stacker direction={"column"}>
            {/* Banning from every venue needs to see every venue */}
            {user?.role === Role.ADMIN && (
                <CreateButton
                    text="Create New Ban"
                    onClick={async () => await navigate({ to: "/create-ban" })}
                />
            )}

            <BannedPeopleSearch
                people={blanketBanned}
                isPending={bannedPeopleQuery.isPending || venueIdsQuery.isPending}
                isError={bannedPeopleQuery.isError || venueIdsQuery.isError}
                emptyText="No one is currently banned from every venue"
            />
        </Stacker>
    );
};

export default BlanketBansTab;
