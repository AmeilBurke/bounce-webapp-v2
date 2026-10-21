import { SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import BanHistory from "./BanHistory";
import BannedPersonCard from "./BannedPersonCard";
import Dialog from "./Dialog";
import EmptyMessage from "./EmptyMessage";
import FieldInput from "./FieldInput";
import SectionLabel from "./SectionLabel";
import Stacker from "./Stacker";
import { CARD_GRID_COLUMNS, CardGridSkeleton, ImageCardSkeleton } from "./Skeletons";
import type { BannedPerson } from "@/types/BannedPerson";
import { isBanActive } from "@/utils/bans";

type BannedPeopleSearchProps = {
    // Each person's bans should already be narrowed to the ones that matter here
    people: BannedPerson[];
    isPending: boolean;
    isError: boolean;
    emptyText: string;
    // Off on the blanket bans list, where everyone is banned from every venue anyway
    showVenues?: boolean;
};

const BannedPeopleSearch = ({ people, isPending, isError, emptyText, showVenues }: BannedPeopleSearchProps) => {
    const [search, setSearch] = useState("");
    const [chosenPersonId, setChosenPersonId] = useState<BannedPerson["id"] | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const filteredPeople = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return people;
        return people.filter((person) => person.name.toLowerCase().includes(term));
    }, [people, search]);

    // Looked up from the live list so edits made in the dialog show straight away
    const chosenPerson = people.find((person) => person.id === chosenPersonId);

    const openDialog = (person: BannedPerson) => {
        setChosenPersonId(person.id);
        setIsDialogOpen(true);
    };

    const renderPeople = () => {
        if (isPending) {
            return <CardGridSkeleton card={<ImageCardSkeleton lines={1} />} />;
        }

        if (isError) {
            return <EmptyMessage kind="error" title="Couldn't load banned people" />;
        }

        if (people.length === 0) {
            return <EmptyMessage title={emptyText} />;
        }

        if (filteredPeople.length === 0) {
            return <EmptyMessage kind="search" title={`No one matches "${search.trim()}"`} />;
        }

        return (
            <SimpleGrid columns={CARD_GRID_COLUMNS} gap={3} w="full">
                {filteredPeople.map((person) => (
                    <BannedPersonCard
                        key={person.id}
                        name={person.name}
                        imagePath={person.imagePath}
                        isActive={person.bans.some((ban) => isBanActive(ban))}
                        onOpen={() => openDialog(person)}
                    />
                ))}
            </SimpleGrid>
        );
    };

    return (
        <Stacker direction={"column"} gap={6}>
            <Skeleton loading={isPending} w="full" rounded="l2">
                <FieldInput
                    label="Search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name"
                    isSearch
                />
            </Skeleton>

            <Stacker direction={"column"} gap={3}>
                <SectionLabel>
                    {isPending || isError
                        ? "People"
                        : `${filteredPeople.length} ${filteredPeople.length === 1 ? "person" : "people"}`}
                </SectionLabel>
                {renderPeople()}
            </Stacker>

            <Dialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onExitComplete={() => setChosenPersonId(undefined)}
                title={`Ban History For ${chosenPerson?.name ?? ""}`}
                body={<BanHistory bans={chosenPerson?.bans ?? []} showVenues={showVenues} />}
            />
        </Stacker>
    );
};

export default BannedPeopleSearch;
