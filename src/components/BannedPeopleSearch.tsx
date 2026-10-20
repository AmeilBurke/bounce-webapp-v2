import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import BanHistory from "./BanHistory";
import BannedPersonCard from "./BannedPersonCard";
import Dialog from "./Dialog";
import FieldInput from "./FieldInput";
import Stacker from "./Stacker";
import { CardGridSkeleton, ImageCardSkeleton } from "./Skeletons";
import type { BannedPerson } from "@/types/BannedPerson";
import { isBanActive } from "@/utils/bans";

type BannedPeopleSearchProps = {
    // Each person's bans should already be narrowed to the ones that matter here
    people: BannedPerson[];
    isPending: boolean;
    isError: boolean;
    emptyText: string;
};

const BannedPeopleSearch = ({ people, isPending, isError, emptyText }: BannedPeopleSearchProps) => {
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
            return <CardGridSkeleton card={<ImageCardSkeleton lines={2} />} />;
        }

        if (isError) {
            return <Text>Couldn't load banned people</Text>;
        }

        if (people.length === 0) {
            return <Text>{emptyText}</Text>;
        }

        if (filteredPeople.length === 0) {
            return <Text>No banned people match "{search.trim()}"</Text>;
        }

        return (
            <SimpleGrid columns={[2, null, null, 4]} columnGap={4} rowGap={8} w="full">
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
        <Stacker direction={"column"}>
            <Skeleton loading={isPending} w="full">
                <FieldInput
                    label="Search"
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name"
                />
            </Skeleton>

            {renderPeople()}

            <Dialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onExitComplete={() => setChosenPersonId(undefined)}
                title={`Ban History For ${chosenPerson?.name ?? ""}`}
                body={<BanHistory bans={chosenPerson?.bans ?? []} />}
            />
        </Stacker>
    );
};

export default BannedPeopleSearch;
