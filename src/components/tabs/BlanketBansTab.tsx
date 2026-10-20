import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import BannedPeopleSearch from "../BannedPeopleSearch";
import CreateButton from "../CreateButton";
import Stacker from "../Stacker";
import { blanketBannedPeopleQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { Role } from "@/types/Role";

const BlanketBansTab = () => {
    const navigate = useNavigate();
    const { data: user } = useQuery(userDetailsQueryOptions);
    const { data: blanketBanned, isPending, isError } = useQuery(blanketBannedPeopleQueryOptions);

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
                people={blanketBanned ?? []}
                isPending={isPending}
                isError={isError}
                emptyText="No one is currently banned from every venue"
            />
        </Stacker>
    );
};

export default BlanketBansTab;
