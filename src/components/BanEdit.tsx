import { Button, HStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiErrorMessage } from "@/utils/errors";
import Form from "./Form";
import Stacker from "./Stacker";
import UpdateBanForm from "./forms/UpdateBanForm";
import updateBan from "@/api-requests/bans/updateBan";
import { UpdateBanSchema, type UpdateBanFormValues } from "@/schemas/update-ban.schema";
import type { Ban } from "@/types/BannedPerson";
import type { UpdateBanDto } from "@/types/dto/update-ban-dto";
import { endOfDayIso, startOfDayIso, toDateInputValue } from "@/utils/bans";

type Option = { label: string; value: string };

type BanEditProps = {
    ban: Ban;
    venueOptions: Option[];
    onDone: () => void;
};

const BanEdit = ({ ban, venueOptions, onDone }: BanEditProps) => {
    const initialValues: UpdateBanFormValues = {
        reason: ban.reason,
        startDate: toDateInputValue(new Date(ban.startDate)),
        endDate: toDateInputValue(new Date(ban.endDate)),
        venueIds: ban.venueBans.map((venueBan) => venueBan.venueId),
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<UpdateBanFormValues>({
        resolver: zodResolver(UpdateBanSchema),
        mode: "onChange",
        defaultValues: initialValues,
    });

    const queryClient = useQueryClient();

    const onUpdateBan = async (data: UpdateBanFormValues) => {
        // Unchanged dates are left out so the ban keeps its exact original times
        const updateBanDto: UpdateBanDto = {
            reason: data.reason,
            startDate:
                data.startDate !== initialValues.startDate ? startOfDayIso(data.startDate) : undefined,
            endDate: data.endDate !== initialValues.endDate ? endOfDayIso(data.endDate) : undefined,
            venueIds: data.venueIds,
        };

        try {
            await updateBan(updateBanDto, ban.id);
            toast.success("Ban Updated");
            // Pending bans can be edited too, so refresh the pending list as well
            await Promise.all([
                refresh(queryClient, ["bans"]),
                refresh(queryClient, ["banned-people"]),
            ]);
            onDone();
        } catch (err) {
            toast.error(apiErrorMessage(err, "Couldn't update ban"));
        }
    };

    return (
        <Form w="full" onSubmit={handleSubmit(onUpdateBan)}>
            <Stacker direction="column" gap={4}>
                <UpdateBanForm control={control} errors={errors} venueOptions={venueOptions} />

                <HStack w="full" justify="flex-end">
                    <Button onClick={onDone} variant="outline" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                        Save
                    </Button>
                </HStack>
            </Stacker>
        </Form>
    );
};

export default BanEdit;
