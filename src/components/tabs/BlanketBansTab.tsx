import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import BannedPeopleSearch from "../BannedPeopleSearch";
import CreateButton from "../CreateButton";
import Stacker from "../Stacker";
import TabHeader from "../TabHeader";
import { blanketBannedPeopleQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";

const BlanketBansTab = () => {
    const navigate = useNavigate();
    const { data: user } = useQuery(userDetailsQueryOptions);
    const { data: blanketBanned, isPending, isError } = useQuery(blanketBannedPeopleQueryOptions);

    return (
        <Stacker direction={"column"}>
            <TabHeader
                title="Blanket Bans"
                description="People currently banned from every venue"
                aside={
                    // Banning from every venue needs to see every venue
                    user?.role === Role.ADMIN && (
                        <CreateButton
                            text="New Ban"
                            onClick={async () => await navigate({ to: "/create-ban" })}
                        />
                    )
                }
            />

            <BannedPeopleSearch
                people={blanketBanned ?? []}
                isPending={isPending}
                isError={isError}
                emptyText="No one is currently banned from every venue"
                showVenues={false}
            />
        </Stacker>
    );
};

export default BlanketBansTab;
