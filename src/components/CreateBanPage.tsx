import createNewBan from "@/api-requests/bans/createNewBan";
import createNewBannedPerson from "@/api-requests/banned-people/createNewBannedPerson";
import Form from "@/components/Form";
import CreateBanForm from "@/components/forms/CreateBanForm";
import LayoutCreate from "@/components/layouts/LayoutCreate";
import Stacker from "@/components/Stacker";
import { CreateBanSchema, NEW_PERSON, type CreateBanFormValues } from "@/schemas/create-ban.schema";
import type { CreateBanDto } from "@/types/dto/create-ban-dto";
import type { Venue } from "@/types/Venue";
import { endOfDayIso, startOfDayIso, toDateInputValue } from "@/utils/bans";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { refresh } from "@/utils/queries";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type CreateBanPageProps = {
  defaultVenueIds: Venue["id"][];
  subheading: string;
  onCreated: () => Promise<void>;
};

const CreateBanPage = ({ defaultVenueIds, subheading, onCreated }: CreateBanPageProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateBanFormValues>({
    resolver: zodResolver(CreateBanSchema),
    mode: "onChange",
    defaultValues: {
      personId: "",
      startDate: toDateInputValue(new Date()),
      endDate: "",
      venueIds: defaultVenueIds,
    },
  });

  const queryClient = useQueryClient();

  // Keeps a newly added person if the ban itself fails, so retrying doesn't add them twice
  const [createdPersonId, setCreatedPersonId] = useState<string | undefined>(undefined);

  const onCreateBan = async (data: CreateBanFormValues) => {
    try {
      let bannedPersonId = data.personId;

      if (data.personId === NEW_PERSON) {
        bannedPersonId =
          createdPersonId ??
          (await createNewBannedPerson({ image: data.image![0], name: data.name! })).id;
        setCreatedPersonId(bannedPersonId);
      }

      const createBanDto: CreateBanDto = {
        reason: data.reason,
        startDate: startOfDayIso(data.startDate),
        endDate: endOfDayIso(data.endDate),
        bannedPersonId,
        venueIds: data.venueIds,
      };

      const ban = await createNewBan(createBanDto);
      toast.success(ban.isPending ? "Ban submitted for approval" : "Ban Created");

      refresh(queryClient, ["banned-people"]);

      await onCreated();
    } catch {
      toast.error("Couldn't create ban");
      setError("root.serverError", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  };


  return (
    <LayoutCreate
      heading={"Create New Ban"}
      subheading={subheading}
      returnArrow
    >

      <Stacker direction={"column"}>
        <Form w="full" onSubmit={handleSubmit(onCreateBan)}>
          <Stacker direction="column">
            <CreateBanForm control={control} errors={errors} />
            <Button
              w={["full", null, null, "auto"]}
              type="submit"
              alignSelf={"flex-end"}
              disabled={!isValid}
              loading={isSubmitting}
            >
              Create Ban
            </Button>
          </Stacker>
        </Form>
      </Stacker>
    </LayoutCreate>
  );
};

export default CreateBanPage;
